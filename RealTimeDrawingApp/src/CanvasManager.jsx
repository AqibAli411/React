// CanvasManager.jsx - Main orchestrator component
import { useRef, useEffect, useCallback, useMemo } from "react";
import useWebSocket from "./useWebSocket";
import { useDrawingState } from "./hooks/useDrawingState";
import { useCanvasRenderer } from "./hooks/useCanvasRenderer";
import { useUndoRedo } from "./hooks/useUndoRedo";
import { useEraser } from "./hooks/useEraser";
import { useInfiniteCanvas } from "./hooks/useInfiniteCanvas";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { STROKE_OPTIONS } from "./utils/drawingUtils";
import Toolbar from "./components/Toolbar";

export default function CanvasManager() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const isMounted = useRef(false);

  // Initialize drawing state management
  const {
    isDrawing,
    currentToolRef,
    myStroke,
    liveStrokes,
    completedStrokes,
    myUserId,
    currentStrokeId,
    addCompletedStroke,
    clearLocalStroke,
    startNewStroke,
    addPointToStroke,
  } = useDrawingState();

  // Initialize eraser functionality
  const {
    isErasing,
    startErasing,
    continueErasing,
    stopErasing,
    getErasedStrokes,
  } = useEraser(completedStrokes, isDrawing);

  // Initialize infinite canvas
  const {
    viewport,
    transform,
    isPanning,
    startPan,
    continuePan,
    stopPan,
    zoomIn,
    zoomOut,
    resetView,
    getCanvasPoint,
  } = useInfiniteCanvas(canvasRef);

  // Initialize canvas renderer
  const { scheduleRedraw } = useCanvasRenderer(ctxRef, canvasRef, {
    completedStrokes,
    liveStrokes,
    myStroke,
    isDrawing,
    currentTool: currentToolRef.current,
    viewport,
    transform,
  });

  // Initialize undo/redo system
  const { undo, redo, canUndo, canRedo, addToHistory, clearHistory } =
    useUndoRedo(completedStrokes, scheduleRedraw);

  // WebSocket message handlers
  const onDraw = useCallback(
    (message) => {
      if (!isMounted.current) return;

      try {
        const {
          x,
          y,
          pressure,
          strokeId: incomingStrokeId,
          userId,
          tool,
        } = JSON.parse(message.body);

        //doesn't run for one actually drawing ( doesn't run locally)
        if (userId === myUserId.current) return;

        //for identification of each stroke we define its id -> strokeId
        if (!liveStrokes.current.has(incomingStrokeId)) {
          liveStrokes.current.set(incomingStrokeId, {
            points: [],
            userId: userId,
            tool: tool || "pen",
            lastUpdate: performance.now(),
          });
        }

        const strokeData = liveStrokes.current.get(incomingStrokeId);
        strokeData.points.push([x, y, pressure]);
        strokeData.lastUpdate = performance.now();

        scheduleRedraw();
      } catch (error) {
        console.error("Error parsing draw message:", error);
      }
    },
    [scheduleRedraw, myUserId, liveStrokes]
  );

  const onStop = useCallback(
    (message) => {
      if (!isMounted.current) return;

      try {
        const {
          currentStrokes,
          strokeId: completedStrokeId,
          userId,
          tool,
        } = JSON.parse(message.body);

        if (liveStrokes.current.has(completedStrokeId)) {
          liveStrokes.current.delete(completedStrokeId);
        }

        if (
          Number(userId) !== Number(myUserId.current) &&
          currentStrokes &&
          currentStrokes.length > 0
        ) {
          const strokeWithMetadata = {
            points: currentStrokes,
            tool: tool || "pen",
            id: completedStrokeId,
            userId: userId,
          };
          addCompletedStroke(strokeWithMetadata);
          addToHistory(); // Add to undo history
        }

        scheduleRedraw();
      } catch (error) {
        console.error("Error parsing stop message:", error);
      }
    },
    [scheduleRedraw, liveStrokes, myUserId, addCompletedStroke, addToHistory]
  );

  const { client } = useWebSocket(onDraw, onStop);

  // Set mounted flag
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Canvas setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    ctxRef.current = ctx;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const handleResize = () => {
      const newRect = canvas.getBoundingClientRect();
      canvas.width = newRect.width * dpr;
      canvas.height = newRect.height * dpr;
      ctx.scale(dpr, dpr);
      scheduleRedraw();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [scheduleRedraw]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onUndo: () => {
      if (canUndo) {
        undo();
        scheduleRedraw();
      }
    },
    onRedo: () => {
      if (canRedo) {
        redo();
        scheduleRedraw();
      }
    },
    onToggleEraser: () =>
      currentToolRef.current === "eraser" ? "pen" : "eraser",
    onResetView: resetView,
  });

  // Event handlers
  const handlePointerDown = useCallback(
    (e) => {
      if (!client) return;
      e.preventDefault();

      // Check if space is held for panning
      if (e.ctrlKey || e.metaKey) {
        startPan(e);
        return;
      }

      const point = getCanvasPoint(e); //gets canvas point responsively

      //checks if tool is eraser
      if (currentToolRef.current === "eraser") {
        //this returns the points tobe removed from canvas
        //here we are removing locally
        const erasedStrokes = startErasing(point);
        if (erasedStrokes.length > 0) {
          // Remove erased strokes from completed strokes and add to history
          erasedStrokes.forEach((strokeId) => {
            completedStrokes.current = completedStrokes.current.filter(
              (s) => s.id !== strokeId
            );
          });
          //   addToHistory();
        }
        scheduleRedraw();
      } else {
        const newStrokeId = startNewStroke(point);

        client.publish({
          destination: "/app/draw.points",
          body: JSON.stringify({
            x: point[0],
            y: point[1],
            pressure: point[2],
            strokeId: newStrokeId,
            userId: myUserId.current,
            tool: currentToolRef.current,
          }),
        });
      }
    },
    [
      client,
      getCanvasPoint,
      currentToolRef,
      startPan,
      startErasing,
      startNewStroke,
      scheduleRedraw,
      myUserId,
      completedStrokes,
      //   addToHistory,
    ]
  );

  const handlePointerMove = useCallback(
    (e) => {
      if (!client) return;
      e.preventDefault();

      const point = getCanvasPoint(e);

      if (isPanning.current) {
        continuePan(e);
        scheduleRedraw();
        return;
      }

      if (!isDrawing.current) return;

      if (currentToolRef.current === "eraser") {
        const erasedStrokes = continueErasing(point);
        if (erasedStrokes.length > 0) {
          // Remove erased strokes from completed strokes and add to history
          erasedStrokes.forEach((strokeId) => {
            completedStrokes.current = completedStrokes.current.filter(
              (s) => s.id !== strokeId
            );
          });
        }
        scheduleRedraw();
      } else {
        addPointToStroke(point);
        scheduleRedraw();

        // Throttled network update
        const now = performance.now();
        //this gives nearly 60fps
        if (now - lastEventTime.current >= 16) {
          lastEventTime.current = now;
          client.publish({
            destination: "/app/draw.points",
            body: JSON.stringify({
              x: point[0],
              y: point[1],
              pressure: point[2],
              strokeId: currentStrokeId.current,
              userId: myUserId.current,
              tool: currentToolRef.current,
            }),
          });
        }
      }
    },
    [
      client,
      getCanvasPoint,
      isPanning,
      continuePan,
      isDrawing,
      currentToolRef,
      continueErasing,
      addPointToStroke,
      scheduleRedraw,
      myUserId,
      completedStrokes,
      currentStrokeId,
    ]
  );

  const lastEventTime = useRef(0);

  const handlePointerUp = useCallback(() => {
    if (isPanning.current) {
      stopPan();
      return;
    }

    if (!isDrawing.current || !client) return;

    if (currentToolRef.current === "eraser") {
      stopErasing();
    } else {
      const strokeData = clearLocalStroke();
      if (strokeData.points.length > 0) {
        const strokeWithMetadata = {
          points: strokeData.points,
          tool: currentToolRef.current,
          id: strokeData.id,
          userId: myUserId.current,
        };

        addCompletedStroke(strokeWithMetadata);
        addToHistory();

        //send to network
        client.publish({
          destination: "/app/add.strokes",
          body: JSON.stringify({
            currentStrokes: strokeData.points,
            strokeId: strokeData.id,
            userId: myUserId.current,
            tool: currentToolRef.current,
          }),
        });
      }
    }

    scheduleRedraw();
  }, [
    isPanning,
    stopPan,
    isDrawing,
    client,
    currentToolRef,
    stopErasing,
    clearLocalStroke,
    addCompletedStroke,
    addToHistory,
    scheduleRedraw,
    myUserId,
  ]);

  const canvasStyle = useMemo(
    () => ({
      width: "100vw",
      height: "100vh",
      display: "block",
      touchAction: "none",
      background: "#f8f9fa",
      cursor: isPanning.current
        ? "grabbing"
        : currentToolRef.current === "eraser"
        ? "crosshair"
        : currentToolRef.current === "pan"
        ? "grab"
        : "crosshair",
      userSelect: "none",
    }),
    [isPanning, currentToolRef]
  );

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      <Toolbar
        currentToolRef={currentToolRef}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onResetView={resetView}
        zoom={viewport.zoom}
      />

      <canvas
        ref={canvasRef}
        style={canvasStyle}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onWheel={(e) => {
          e.preventDefault();
          if (e.deltaY < 0) {
            zoomIn(getCanvasPoint(e));
          } else {
            zoomOut(getCanvasPoint(e));
          }
          scheduleRedraw();
        }}
      />
    </div>
  );
}
