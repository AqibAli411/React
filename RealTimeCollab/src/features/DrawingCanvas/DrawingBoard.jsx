import { useRef, useEffect, useCallback, useMemo } from "react";
import { getStroke } from "perfect-freehand";
import useWebSocket from "./useWebSocket";

// Unified stroke options for consistency
const STROKE_OPTIONS = {
  size: 2.5,
  thinning: -0.3,
  smoothing: 0.35,
  streamline: 0.15,
  easing: (t) => t,
  start: { taper: 0, easing: (t) => t },
  end: { taper: 0, easing: (t) => t },
};

// Optimized stroke rendering with consistent quality
function drawStrokePoints(ctx, points) {
  if (points.length === 0) return;

  // For single points, draw a small circle
  if (points.length === 1) {
    const [x, y, pressure = 0.5] = points[0];
    const radius = (STROKE_OPTIONS.size * pressure) / 2;
    ctx.beginPath();
    ctx.arc(x, y, Math.max(radius, 1), 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  // For very short strokes (2-3 points), use simple line rendering
  if (points.length < 4) {
    ctx.beginPath();
    ctx.lineWidth = STROKE_OPTIONS.size;
    ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i][0], points[i][1]);
    }
    ctx.stroke();
    return;
  }

  // For longer strokes, use perfect-freehand for consistency
  const strokePoints = getStroke(points, STROKE_OPTIONS);

  if (strokePoints.length < 3) return;

  ctx.beginPath();
  ctx.moveTo(strokePoints[0][0], strokePoints[0][1]);

  // Use quadratic curves for smoother rendering
  for (let i = 1; i < strokePoints.length - 1; i++) {
    const [x0, y0] = strokePoints[i];
    const [x1, y1] = strokePoints[i + 1];
    const cpx = (x0 + x1) / 2;
    const cpy = (y0 + y1) / 2;
    ctx.quadraticCurveTo(x0, y0, cpx, cpy);
  }

  // Complete the path
  const lastPoint = strokePoints[strokePoints.length - 1];
  ctx.lineTo(lastPoint[0], lastPoint[1]);
  ctx.closePath();
  ctx.fill();
}

export default function DrawingBoard() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const isDrawing = useRef(false);
  const isMounted = useRef(false);

  // Multi-user stroke management
  const myStroke = useRef([]); // My current stroke (local only)
  const liveStrokes = useRef(new Map()); // Live strokes from other users (strokeId -> points array)
  const completedStrokes = useRef([]); // All completed strokes
  const myUserId = useRef(0); // Simple user ID

  // Performance optimization refs
  const animationFrameRef = useRef(null);
  const lastEventTime = useRef(0);
  const strokeId = useRef(0);
  const currentStrokeId = useRef(null);

  // Optimized throttling config
  const MOVE_THROTTLE_MS = 16; // ~60fps for network (balance between smoothness and bandwidth)
  const RENDER_THROTTLE_MS = 8; // ~120fps for local rendering
  const MIN_DISTANCE = 0.5; // Minimum distance between points
  const lastPoint = useRef(null);
  const lastRenderTime = useRef(0);

  // Get accurate cursor position relative to canvas
  const getCanvasPoint = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return [0, 0];

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return [
      (e.clientX - rect.left) * scaleX,
      (e.clientY - rect.top) * scaleY,
      e.pressure || 0.5,
    ];
  }, []);

  // Optimized redraw with live collaborative rendering
  const redraw = useCallback(() => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas || !isMounted.current) return;

    // Clear canvas efficiently
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set consistent rendering properties
    ctx.fillStyle = "#000000";
    ctx.strokeStyle = "#000000";
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    // Draw all completed strokes
    for (const stroke of completedStrokes.current) {
      if (stroke && stroke.length > 0) {
        drawStrokePoints(ctx, stroke);
      }
    }

    // Draw live strokes from other users (slightly different color)
    ctx.fillStyle = "#222222";
    ctx.strokeStyle = "#222222";

    for (const [_, strokeData] of liveStrokes.current) {
      if (strokeData && strokeData.points && strokeData.points.length > 0) {
        drawStrokePoints(ctx, strokeData.points);
      }
    }

    // Draw my current stroke (priority rendering - darkest color)
    if (isDrawing.current && myStroke.current.length > 0) {
      ctx.fillStyle = "#000000";
      ctx.strokeStyle = "#000000";
      drawStrokePoints(ctx, myStroke.current);
    }
  }, []);

  // Throttled redraw to prevent excessive rendering
  const scheduleRedraw = useCallback(() => {
    const now = performance.now();
    if (now - lastRenderTime.current < RENDER_THROTTLE_MS) {
      if (animationFrameRef.current) return;

      animationFrameRef.current = requestAnimationFrame(() => {
        const renderNow = performance.now();
        if (renderNow - lastRenderTime.current >= RENDER_THROTTLE_MS) {
          redraw();
          lastRenderTime.current = renderNow;
        }
        animationFrameRef.current = null;
      });
      return;
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      redraw();
      lastRenderTime.current = performance.now();
      animationFrameRef.current = null;
    });
  }, [redraw]);

  // Handle live drawing points from other users
  const onDraw = useCallback(
    (message) => {
      if (!isMounted.current) return;

      try {
        const data = JSON.parse(message.body);
        console.log("Received draw message:", data); // Debug log

        const { x, y, pressure, strokeId: incomingStrokeId, userId } = data;

        // Ignore our own strokes (prevent echo)
        if (userId === myUserId.current) {
          console.log("Ignoring own stroke echo");
          return;
        }

        console.log(
          "Processing live stroke from user:",
          userId,
          "strokeId:",
          incomingStrokeId
        );

        // Add point to live stroke
        if (!liveStrokes.current.has(incomingStrokeId)) {
          console.log("Creating new live stroke:", incomingStrokeId);
          liveStrokes.current.set(incomingStrokeId, {
            points: [],
            userId: userId,
            lastUpdate: performance.now(),
          });
        }

        const strokeData = liveStrokes.current.get(incomingStrokeId);
        strokeData.points.push([x, y, pressure]);
        strokeData.lastUpdate = performance.now();

        console.log("Live stroke now has", strokeData.points.length, "points");
        scheduleRedraw();
      } catch (error) {
        console.error("Error parsing draw message:", error);
      }
    },
    [scheduleRedraw]
  );

  // Handle completed strokes
  const onStop = useCallback(
    (message) => {
      if (!isMounted.current) return;

      try {
        const data = JSON.parse(message.body);
        console.log("Received stop message:", data); // Debug log

        const { currentStrokes, strokeId: completedStrokeId, userId } = data;

        // Remove from live strokes and add to completed strokes
        if (liveStrokes.current.has(completedStrokeId)) {
          console.log("Moving live stroke to completed:", completedStrokeId);
          liveStrokes.current.delete(completedStrokeId);
        }

        // Add to completed strokes (ignore our own - we handle locally)
        if (
          userId !== myUserId.current &&
          currentStrokes &&
          currentStrokes.length > 0
        ) {
          console.log("Adding completed stroke from user:", userId);
          completedStrokes.current.push(currentStrokes);
        }

        scheduleRedraw();
      } catch (error) {
        console.error("Error parsing stop message:", error);
      }
    },
    [scheduleRedraw]
  );

  const { client } = useWebSocket(onDraw, onStop);

  // Set mounted flag
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Canvas setup with high-DPI support
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    ctxRef.current = ctx;

    // High-DPI support
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    ctx.scale(dpr, dpr);

    // Optimize canvas for drawing
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.fillStyle = "#000000";
    ctx.strokeStyle = "#000000";
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Handle window resize
    const handleResize = () => {
      const newRect = canvas.getBoundingClientRect();
      canvas.width = newRect.width * dpr;
      canvas.height = newRect.height * dpr;
      ctx.scale(dpr, dpr);
      scheduleRedraw();
    };

    window.addEventListener("resize", handleResize);

    // Clean up old live strokes periodically (prevent memory leaks)
    const cleanupInterval = setInterval(() => {
      const now = performance.now();
      const STROKE_TIMEOUT = 30000; // 30 seconds

      for (const [strokeId, strokeData] of liveStrokes.current) {
        if (now - strokeData.lastUpdate > STROKE_TIMEOUT) {
          liveStrokes.current.delete(strokeId);
        }
      }
    }, 10000);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearInterval(cleanupInterval);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [scheduleRedraw]);

  // Smart point filtering to reduce network traffic
  const shouldAddPoint = useCallback((point) => {
    if (!lastPoint.current) return true;

    const [x, y] = point;
    const [lastX, lastY] = lastPoint.current;
    const distance = Math.sqrt((x - lastX) ** 2 + (y - lastY) ** 2);

    return distance >= MIN_DISTANCE;
  }, []);

  // Optimized event handlers with live collaboration
  const handlePointerDown = useCallback(
    (e) => {
      if (!client) return;

      e.preventDefault();
      isDrawing.current = true;

      const point = getCanvasPoint(e);
      strokeId.current += 1;
      currentStrokeId.current = strokeId.current;
      myUserId.current = strokeId.current + 1;

      console.log(
        "Starting stroke:",
        currentStrokeId.current,
        "for user:",
        myUserId.current
      ); // Debug log

      // Start new local stroke with immediate feedback
      myStroke.current = [point];
      lastPoint.current = point;
      scheduleRedraw();

      // Send to server for live collaboration
      console.log("Sending pointerDown to server");
      client.publish({
        destination: "/app/draw.points",
        body: JSON.stringify({
          x: point[0],
          y: point[1],
          pressure: point[2],
          strokeId: currentStrokeId.current,
          userId: myUserId.current,
        }),
      });
    },
    [client, getCanvasPoint, scheduleRedraw]
  );

  const handlePointerMove = useCallback(
    (e) => {
      if (!isDrawing.current || !client) return;

      e.preventDefault();

      // Throttle network events but not local rendering
      const now = performance.now();
      const shouldSendToNetwork =
        now - lastEventTime.current >= MOVE_THROTTLE_MS;

      const point = getCanvasPoint(e);

      if (!shouldAddPoint(point)) return;

      // Always update local stroke immediately (smooth local experience)
      myStroke.current.push(point);
      lastPoint.current = point;
      scheduleRedraw();

      // Send to network (throttled)
      if (shouldSendToNetwork) {
        lastEventTime.current = now;
        console.log(
          "Sending pointerMove to server, points so far:",
          myStroke.current.length
        );
        client.publish({
          destination: "/app/draw.points",
          body: JSON.stringify({
            x: point[0],
            y: point[1],
            pressure: point[2],
            strokeId: currentStrokeId.current,
            userId: myUserId.current,
          }),
        });
      }
    },
    [client, getCanvasPoint, scheduleRedraw, shouldAddPoint]
  );

  const handlePointerUp = useCallback(() => {
    if (!isDrawing.current || !client) return;

    isDrawing.current = false;

    console.log(
      "Ending stroke:",
      currentStrokeId.current,
      "with",
      myStroke.current.length,
      "points"
    );

    if (myStroke.current.length > 0) {
      // Add to completed strokes locally (immediate feedback)
      completedStrokes.current.push([...myStroke.current]);

      // Send final stroke to server
      console.log("Sending final stroke to server");
      client.publish({
        destination: "/app/add.strokes",
        body: JSON.stringify({
          currentStrokes: myStroke.current,
          strokeId: currentStrokeId.current,
          userId: myUserId.current,
        }),
      });
    }

    // Clear local stroke state
    myStroke.current = [];
    lastPoint.current = null;
    currentStrokeId.current = null;

    scheduleRedraw();
  }, [client, scheduleRedraw]);

  const canvasStyle = useMemo(
    () => ({
      width: "100vw",
      height: "100vh",
      display: "block",
      touchAction: "none",
      background: "#fff",
      cursor: "crosshair",
      userSelect: "none",
    }),
    []
  );

  return (
    <canvas
      ref={canvasRef}
      style={canvasStyle}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    />
  );
}
