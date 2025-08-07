// hooks/useInfiniteCanvas.js
import { useRef, useCallback, useState } from "react";

export function useInfiniteCanvas(canvasRef) {
  const [viewport, setViewport] = useState({
    x: 0,
    y: 0,
    zoom: 1,
  });

  const [transform, setTransform] = useState({
    x: 0,
    y: 0,
    scale: 1,
  });

  const isPanning = useRef(false);
  const lastPanPoint = useRef(null);
  const panStartPoint = useRef(null);

  // Convert screen coordinates to canvas coordinates
  const getCanvasPoint = useCallback(
    (e) => {
      const canvas = canvasRef.current;
      if (!canvas) return [0, 0, 0.5];

      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      // Screen coordinates
      const screenX = (e.clientX - rect.left) * scaleX;
      const screenY = (e.clientY - rect.top) * scaleY;

      // Convert to canvas coordinates accounting for transform
      const canvasX = (screenX - transform.x) / transform.scale;
      const canvasY = (screenY - transform.y) / transform.scale;

      return [canvasX, canvasY, e.pressure || 0.5];
    },
    [transform, canvasRef]
  );

  // Convert canvas coordinates to screen coordinates
  const getScreenPoint = useCallback(
    (canvasX, canvasY) => {
      const screenX = canvasX * transform.scale + transform.x;
      const screenY = canvasY * transform.scale + transform.y;
      return [screenX, screenY];
    },
    [transform]
  );

  const updateTransform = useCallback((newTransform) => {
    setTransform(newTransform);
    setViewport({
      x: -newTransform.x / newTransform.scale,
      y: -newTransform.y / newTransform.scale,
      zoom: newTransform.scale,
    });
  }, []);

  const startPan = useCallback(
    (e) => {
      isPanning.current = true;
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      panStartPoint.current = {
        x: e.clientX,
        y: e.clientY,
      };
      lastPanPoint.current = {
        x: e.clientX,
        y: e.clientY,
      };
    },
    [canvasRef]
  );

  const continuePan = useCallback(
    (e) => {
      if (!isPanning.current || !lastPanPoint.current) return;

      const deltaX = e.clientX - lastPanPoint.current.x;
      const deltaY = e.clientY - lastPanPoint.current.y;

      const newTransform = {
        ...transform,
        x: transform.x + deltaX,
        y: transform.y + deltaY,
      };

      updateTransform(newTransform);

      lastPanPoint.current = {
        x: e.clientX,
        y: e.clientY,
      };
    },
    [transform, updateTransform]
  );

  const stopPan = useCallback(() => {
    isPanning.current = false;
    lastPanPoint.current = null;
    panStartPoint.current = null;
  }, []);

  const zoomIn = useCallback(
    (centerPoint) => {
      const zoomFactor = 1.2;
      const newScale = Math.min(transform.scale * zoomFactor, 5); // Max zoom 5x

      let newX = transform.x;
      let newY = transform.y;

      if (centerPoint) {
        const [centerX, centerY] = centerPoint;
        newX = centerX - (centerX - transform.x) * (newScale / transform.scale);
        newY = centerY - (centerY - transform.y) * (newScale / transform.scale);
      }

      updateTransform({
        x: newX,
        y: newY,
        scale: newScale,
      });
    },
    [transform, updateTransform]
  );

  const zoomOut = useCallback(
    (centerPoint) => {
      const zoomFactor = 1 / 1.2;
      const newScale = Math.max(transform.scale * zoomFactor, 0.1); // Min zoom 0.1x

      let newX = transform.x;
      let newY = transform.y;

      if (centerPoint) {
        const [centerX, centerY] = centerPoint;
        newX = centerX - (centerX - transform.x) * (newScale / transform.scale);
        newY = centerY - (centerY - transform.y) * (newScale / transform.scale);
      }

      updateTransform({
        x: newX,
        y: newY,
        scale: newScale,
      });
    },
    [transform, updateTransform]
  );

  const resetView = useCallback(() => {
    updateTransform({
      x: 0,
      y: 0,
      scale: 1,
    });
  }, [updateTransform]);

  const setZoom = useCallback(
    (zoom, centerPoint) => {
      const newScale = Math.max(0.1, Math.min(5, zoom));

      let newX = transform.x;
      let newY = transform.y;

      if (centerPoint) {
        const [centerX, centerY] = centerPoint;
        newX = centerX - (centerX - transform.x) * (newScale / transform.scale);
        newY = centerY - (centerY - transform.y) * (newScale / transform.scale);
      }

      updateTransform({
        x: newX,
        y: newY,
        scale: newScale,
      });
    },
    [transform, updateTransform]
  );

  // Check if a point is visible in the current viewport
  const isPointVisible = useCallback(
    (x, y, margin = 100) => {
      const canvas = canvasRef.current;
      if (!canvas) return true;

      const [screenX, screenY] = getScreenPoint(x, y);

      return (
        screenX >= -margin &&
        screenX <= canvas.width + margin &&
        screenY >= -margin &&
        screenY <= canvas.height + margin
      );
    },
    [getScreenPoint, canvasRef]
  );

  return {
    viewport,
    transform,
    isPanning,
    startPan,
    continuePan,
    stopPan,
    zoomIn,
    zoomOut,
    resetView,
    setZoom,
    getCanvasPoint,
    getScreenPoint,
    isPointVisible,
    updateTransform,
  };
}
