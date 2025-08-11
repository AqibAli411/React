import { useRef, useEffect, useCallback } from "react";
import useWebSocket from "./hooks/useWebSocket";
import { useDrawingState } from "./hooks/useDrawingState";
import { useCanvasRenderer } from "./hooks/useCanvasRenderer";
import { useUndoRedo } from "./hooks/useUndoRedo";
import { useEraser } from "./hooks/useEraser";
import { useInfiniteCanvas } from "./hooks/useInfiniteCanvas";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import CanvasDraw from "./CanvasDraw";
import DrawOptions from "../../components/DrawOptions";

export default function CanvasManager({ isDarkMode }) {
  const canvasRef = useRef(null);
  const containerRef = useRef();
  const ctxRef = useRef(null);
  const isMounted = useRef(false);
  const isDownPressed = useRef(false);
  const penWidth = useRef(2);
  const colorRef = useRef(isDarkMode ? "#000000" : "#ffffff");

  //if use has not selected anything, then -> default behave
  //

  useEffect(
    function () {

      if (isDarkMode) {
        console.log("bhi");
        colorRef.current = "#ffffff";
      } else {
        colorRef.current = "#000000";
      }
    },
    [isDarkMode],
  );

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
    // isErasing,
    startErasing,
    continueErasing,
    stopErasing,
    // getErasedStrokes,
  } = useEraser(completedStrokes, isDrawing);

  // Initialize infinite canvas
  const {
    viewportRef,
    transformRef,
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
  const { scheduleRedraw, drawGrid } = useCanvasRenderer(
    ctxRef,
    canvasRef,
    isDarkMode,
    penWidth,
    colorRef,
    {
      completedStrokes,
      liveStrokes,
      myStroke,
      isDrawing,
      currentTool: currentToolRef.current,
      viewportRef,
      transformRef,
    },
  );

  // Initialize undo/redo system
  const {
    undo,
    redo,
    canUndo,
    canRedo,
    addToHistory,
    //  clearHistory
  } = useUndoRedo(completedStrokes, scheduleRedraw);

  const subUndo = useCallback(
    (message) => {
      if (!isMounted.current) return;

      const { canUndo } = JSON.parse(message.body);
      if (canUndo) undo();
    },
    [undo],
  );

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
          width, // Added width
          color, // Added color
        } = JSON.parse(message.body);
        //doesn't run for one actually drawing ( doesn't run locally)
        if (userId === myUserId.current) return;

        //for identification of each stroke we define its id -> strokeId
        if (!liveStrokes.current.has(incomingStrokeId)) {
          liveStrokes.current.set(incomingStrokeId, {
            points: [],
            userId: userId,
            tool: tool || "pen",
            width: width || 2, // Added width
            color: color || (isDarkMode ? "#ffffff" : "#000000"), // Added color
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
    [scheduleRedraw, myUserId, liveStrokes, isDarkMode],
  );

  // In the onStop callback, update to handle width and color:
  const onStop = useCallback(
    (message) => {
      if (!isMounted.current) return;

      try {
        const {
          currentStrokes,
          strokeId: completedStrokeId,
          userId,
          tool,
          width, // Added width
          color, // Added color
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
            width: width || 2, // Added width
            color: color || (isDarkMode ? "#ffffff" : "#000000"), // Added color
          };
          console.log(strokeWithMetadata.color);
          addCompletedStroke(strokeWithMetadata);
          addToHistory(); // Add to undo history
        }

        scheduleRedraw();
      } catch (error) {
        console.error("Error parsing stop message:", error);
      }
    },
    [
      scheduleRedraw,
      liveStrokes,
      myUserId,
      addCompletedStroke,
      addToHistory,
      isDarkMode,
    ],
  );

  const onErase = useCallback(
    (message) => {
      if (!isMounted.current) return;

      try {
        const {
          erasedStrokes,
          // userId
        } = JSON.parse(message.body);

        if (erasedStrokes.length > 0) {
          // Remove erased strokes from completed strokes and add to history
          erasedStrokes.forEach((strokeId) => {
            completedStrokes.current = completedStrokes.current.filter(
              (s) => s.id !== strokeId,
            );
          });
        }
        scheduleRedraw();
      } catch (error) {
        console.error("Error parsing stop message:", error);
      }
    },
    [completedStrokes, scheduleRedraw],
  );

  const { client } = useWebSocket(onDraw, onStop, subUndo, onErase);

  // Set mounted flag
  useEffect(() => {
    isMounted.current = true;
    scheduleRedraw();

    return () => {
      isMounted.current = false;
    };
  }, [scheduleRedraw, isDarkMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    ctxRef.current = ctx;

    const dpr = window.devicePixelRatio || 1;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      scheduleRedraw();
    };

    // Initial draw
    resizeCanvas();
    drawGrid();
    // Observe container changes
    const observer = new ResizeObserver(resizeCanvas);
    observer.observe(canvas.parentElement); // or the wrapping container

    return () => {
      observer.disconnect();
    };
  }, [scheduleRedraw, drawGrid]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    canUndo,
    client,
    containerRef,
    onRedo: () => {
      if (canRedo) {
        redo();
        scheduleRedraw();
      }
    },
    currentToolRef,
    onResetView: resetView,
    isPanning,
    isDownPressed,
  });

  // Event handlers
  const handlePointerDown = useCallback(
    (e) => {
      if (e.button === 2) return;
      containerRef?.current?.focus();

      if (!client) return;
      isDownPressed.current = true;
      e.preventDefault();

      // Check if space is held for panning
      if (isPanning.current) {
        startPan(e);
        return;
      }

      const point = getCanvasPoint(e);

      if (currentToolRef.current === "eraser") {
        const erasedStrokes = startErasing(point);
        if (erasedStrokes.length === 0) return;

        client.publish({
          destination: "/app/erase.strokes",
          body: JSON.stringify({
            erasedStrokes,
            userId: myUserId.current,
          }),
        });
      } else {
        const newStrokeId = startNewStroke(point);
        scheduleRedraw();

        client.publish({
          destination: "/app/draw.points",
          body: JSON.stringify({
            x: point[0],
            y: point[1],
            pressure: point[2],
            strokeId: newStrokeId,
            userId: myUserId.current,
            tool: currentToolRef.current,
            width: penWidth.current, // Added width
            color: colorRef.current, // Added color
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
      isPanning,
      penWidth, // Added dependency
      colorRef, // Added dependency
    ],
  );

  const handlePointerMove = useCallback(
    (e) => {
      if (!client) return;

      if (!isDownPressed.current) return;

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
        if (erasedStrokes.length === 0) return;

        client.publish({
          destination: "/app/erase.strokes",
          body: JSON.stringify({
            erasedStrokes,
            userId: myUserId.current,
          }),
        });
      } else {
        if (addPointToStroke(point)) scheduleRedraw();

        // Throttled network update
        const now = performance.now();
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
              width: penWidth.current, // Added width
              color: colorRef.current, // Added color
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
      currentStrokeId,
      penWidth,
      colorRef,
    ],
  );

  const lastEventTime = useRef(0);

  const handlePointerUp = useCallback(() => {
    isDownPressed.current = false;

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
          width: penWidth.current, // Added width
          color: colorRef.current, // Added color
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
            width: penWidth.current, // Added width
            color: colorRef.current, // Added color
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
    penWidth,
    colorRef,
  ]);

  return (
    <>
      <DrawOptions
        isDarkMode={isDarkMode}
        currentToolRef={currentToolRef}
        penWidth={penWidth}
        colorRef={colorRef}
        scheduleRedraw={scheduleRedraw}
      />
      <CanvasDraw
        isPanning={isPanning}
        currentToolRef={currentToolRef}
        canvasRef={canvasRef}
        handlePointerDown={handlePointerDown}
        handlePointerMove={handlePointerMove}
        handlePointerUp={handlePointerUp}
        zoomIn={zoomIn}
        zoomOut={zoomOut}
        scheduleRedraw={scheduleRedraw}
        getCanvasPoint={getCanvasPoint}
        isDownPressed={isDownPressed}
        ref={containerRef}
      />
    </>
  );
}
