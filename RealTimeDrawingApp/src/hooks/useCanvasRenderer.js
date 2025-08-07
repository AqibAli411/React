// hooks/useCanvasRenderer.js
import { useCallback, useRef } from "react";
import { drawStrokePoints } from "../utils/drawingUtils";

export function useCanvasRenderer(
  ctxRef,
  canvasRef,
  {
    completedStrokes,
    liveStrokes,
    myStroke,
    isDrawing,
    currentTool,
    viewport,
    transform,
  }
) {
  const animationFrameRef = useRef(null);
  const lastRenderTime = useRef(0);
  const RENDER_THROTTLE_MS = 8; // ~120fps

  // Draw grid for infinite canvas
  const drawGrid = useCallback(
    (ctx, canvas) => {
      if (!viewport || transform.scale < 0.5) return; // Don't show grid when zoomed out

      ctx.save();

      const gridSize = 50 * transform.scale;
      const offsetX = ((transform.x % gridSize) + gridSize) % gridSize;
      const offsetY = ((transform.y % gridSize) + gridSize) % gridSize;

      ctx.strokeStyle = transform.scale > 1 ? "#e0e0e0" : "#f0f0f0";
      ctx.lineWidth = 0.5;
      ctx.setLineDash([]);

      // Draw vertical lines
      for (let x = offsetX; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Draw horizontal lines
      for (let y = offsetY; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      ctx.restore();
    },
    [viewport, transform]
  );

  // Apply canvas transformation
  const applyTransform = useCallback(
    (ctx) => {
      ctx.setTransform(
        transform.scale,
        0,
        0,
        transform.scale,
        transform.x,
        transform.y
      );
    },
    [transform]
  );

  // Reset canvas transformation
  const resetTransform = useCallback((ctx) => {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }, []);

  // Check if stroke is visible in current viewport
  const isStrokeVisible = useCallback(
    (stroke) => {
      if (!stroke.points || stroke.points.length === 0) return false;
      if (transform.scale < 0.1) return false; // Don't render when too zoomed out

      // Simple bounding box check
      let minX = Infinity,
        minY = Infinity;
      let maxX = -Infinity,
        maxY = -Infinity;

      for (const [x, y] of stroke.points) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }

      // Transform bounding box to screen coordinates
      const screenMinX = minX * transform.scale + transform.x;
      const screenMinY = minY * transform.scale + transform.y;
      const screenMaxX = maxX * transform.scale + transform.x;
      const screenMaxY = maxY * transform.scale + transform.y;

      const canvas = canvasRef.current;
      if (!canvas) return true;

      // Check if stroke bounding box intersects with canvas
      const margin = 100; // Extra margin for partially visible strokes
      return !(
        screenMaxX < -margin ||
        screenMinX > canvas.width + margin ||
        screenMaxY < -margin ||
        screenMinY > canvas.height + margin
      );
    },
    [transform, canvasRef]
  );

  const redraw = useCallback(() => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;

    // Clear canvas
    resetTransform(ctx);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    drawGrid(ctx, canvas);

    // Apply transformation for drawing
    applyTransform(ctx);

    // Set drawing properties
    ctx.fillStyle = "#000000";
    ctx.strokeStyle = "#000000";
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    // Draw completed strokes (with visibility culling)
    let renderedStrokes = 0;
    for (const stroke of completedStrokes.current) {
      if (
        stroke &&
        stroke.points &&
        stroke.points.length > 0 &&
        isStrokeVisible(stroke)
      ) {
        // Erased strokes shouldn't be rendered
        if (stroke.tool === "eraser") continue;

        drawStrokePoints(ctx, stroke.points, stroke.tool);
        renderedStrokes++;
      }
    }
    
    /* eslint-disable no-unused-vars */
    for (const [_, strokeData] of liveStrokes.current) {
      if (strokeData && strokeData.points && strokeData.points.length > 0) {
        const tempStroke = { points: strokeData.points };
        if (isStrokeVisible(tempStroke)) {
          drawStrokePoints(ctx, strokeData.points, strokeData.tool || "pen");
        }
      }
    }

    // Draw current local stroke
    if (isDrawing.current && myStroke.current.length > 0)
      drawStrokePoints(ctx, myStroke.current, currentTool);

    // Reset transform for UI elements
    resetTransform(ctx);

    // Debug info (only in development)
    if (process.env.NODE_ENV === "development") {
      ctx.fillStyle = "#666";
      ctx.font = "12px monospace";
      ctx.fillText(`Zoom: ${(transform.scale * 100).toFixed(0)}%`, 10, 20);
      ctx.fillText(
        `Strokes: ${renderedStrokes}/${completedStrokes.current.length}`,
        10,
        35
      );
      ctx.fillText(
        `Pan: ${transform.x.toFixed(0)}, ${transform.y.toFixed(0)}`,
        10,
        50
      );
    }
  }, [
    ctxRef,
    canvasRef,
    completedStrokes,
    liveStrokes,
    myStroke,
    isDrawing,
    currentTool,
    transform,
    drawGrid,
    applyTransform,
    resetTransform,
    isStrokeVisible,
  ]);

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

  return {
    redraw,
    scheduleRedraw,
  };
}
