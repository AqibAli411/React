// hooks/useEraser.js
import { useRef, useCallback } from "react";

export function useEraser(completedStrokes, isDrawing) {
  const isErasing = useRef(false);
  const eraserSize = useRef(20); // Eraser size in pixels
  const lastErasePoint = useRef(null);

  // Check if a point is within eraser distance from a stroke
  const isPointNearStroke = useCallback((point, stroke, threshold) => {
    const [px, py] = point;

    for (const strokePoint of stroke.points) {
      const [sx, sy] = strokePoint;
      const distance = Math.sqrt((px - sx) ** 2 + (py - sy) ** 2);
      //if any one of point has a distance with given stroke less than 0.5 then return true
      if (distance <= threshold) {
        return true;
      }
    }
    return false;
  }, []);

  // Check if any part of a stroke intersects with the eraser path
  const isStrokeInEraserPath = useCallback(
    (stroke, startPoint, endPoint, eraserRadius) => {
      if (!stroke.points || stroke.points.length === 0) return false;

      // Check each point in the stroke against the eraser line segment
      for (const strokePoint of stroke.points) {
        const [sx, sy] = strokePoint;

        // Calculate distance from stroke point to eraser line segment
        const [x1, y1] = startPoint;
        const [x2, y2] = endPoint;

        // M = Ai + Bj
        // N = Ci + Dj
        // M.N = A*C + B*D
        const A = sx - x1;
        const B = sy - y1;

        const C = x2 - x1;
        const D = y2 - y1;

        const dot = A * C + B * D;
        const lenSq = C * C + D * D;

        let param = -1;
        if (lenSq !== 0) {
          param = dot / lenSq;
        }

        let xx, yy;
        if (param < 0) {
          xx = x1;
          yy = y1;
        } else if (param > 1) {
          xx = x2;
          yy = y2;
        } else {
          xx = x1 + param * C;
          yy = y1 + param * D;
        }

        const dx = sx - xx;
        const dy = sy - yy;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= eraserRadius) {
          return true;
        }
      }

      return false;
    },
    []
  );

  //main function responsible for erasing stuff
  const startErasing = useCallback(
    (point) => {
      isDrawing.current = true;
      //sets the isErasing tobe true and records last point
      isErasing.current = true;
      lastErasePoint.current = point;

      // Find strokes to erase at the starting point
      const strokesToErase = [];

      completedStrokes.current.forEach((stroke, index) => {
        if (isPointNearStroke(point, stroke, eraserSize.current)) {
          //recording which strokes are tobe removed
          strokesToErase.push(stroke.id || index);
        }
      });

      return strokesToErase;
    },
    [isPointNearStroke, completedStrokes, isDrawing]
  );

  const continueErasing = useCallback(
    (point) => {
      if (!isErasing.current || !lastErasePoint.current) {
        return [];
      }

      if (!isDrawing.current) return;

      const strokesToErase = [];

      completedStrokes.current.forEach((stroke, index) => {
        const strokeId = stroke.id || index;

        // Check if stroke intersects with eraser path
        if (
          isStrokeInEraserPath(
            stroke,
            lastErasePoint.current,
            point,
            eraserSize.current
          )
        ) {
          strokesToErase.push(strokeId);
        }
      });

      lastErasePoint.current = point;
      return strokesToErase;
    },
    [isStrokeInEraserPath, completedStrokes, isDrawing]
  );

  const stopErasing = useCallback(() => {
    isDrawing.current = false;
    isErasing.current = false;
    lastErasePoint.current = null;
  }, [isDrawing]);

  const getErasedStrokes = useCallback(
    (point) => {
      const strokesToErase = [];

      completedStrokes.current.forEach((stroke, index) => {
        if (isPointNearStroke(point, stroke, eraserSize.current)) {
          strokesToErase.push(stroke.id || index);
        }
      });

      return strokesToErase;
    },
    [isPointNearStroke, completedStrokes]
  );

  //sets the eraser size
  const setEraserSize = useCallback((size) => {
    // 5 =< size <= 100
    eraserSize.current = Math.max(5, Math.min(100, size)); // Min 5px, Max 100px
  }, []);

  const getEraserSize = useCallback(() => {
    return eraserSize.current;
  }, []);

  return {
    isErasing,
    startErasing,
    continueErasing,
    stopErasing,
    getErasedStrokes,
    setEraserSize,
    getEraserSize,
  };
}
