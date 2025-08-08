import { useEffect, useRef, useState } from "react";

function CanvasDraw({
  isPanning,
  currentToolRef,
  canvasRef,
  handlePointerDown,
  handlePointerMove,
  handlePointerUp,
  zoomIn,
  zoomOut,
  scheduleRedraw,
  getCanvasPoint,
  isDownPressed,
}) {
  const containerRef = useRef();
  const [isGrabbing, setIsGrabbing] = useState(false);
  const [isMouseDown, SetIsMouseDown] = useState(false);

  const canvasStyle = {
    width: "100vw",
    height: "100vh",
    display: "block",
    touchAction: "none",
    background: "#f8f9fa",
    cursor: !isGrabbing ? "crosshair" : !isMouseDown ? "grab" : "grabbing",
    userSelect: "none",
  };

  useEffect(() => {
    const handleWheel = (e) => {
      console.log(isPanning.current);
      e.preventDefault(); // now works because passive is false
      if (!e.ctrlKey) return;
      if (e.deltaY < 0) {
        zoomIn(getCanvasPoint(e));
      } else {
        zoomOut(getCanvasPoint(e));
      }
      scheduleRedraw();
    };

    const handleKeyUp = (e) => {
      if (e.key === " " || e.code === "Space") {
        e.preventDefault();
        console.log(isDownPressed.current);
        setIsGrabbing(true);
        return;
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === " " || e.code === "Space") {
        e.preventDefault();
        setIsGrabbing(false);
        return;
      }
    };

    const container = containerRef.current;
    container.addEventListener("wheel", handleWheel, { passive: false });
    document.addEventListener("keydown", handleKeyUp);
    document.addEventListener("keyup", handleKeyDown);

    return () => {
      container.removeEventListener("wheel", handleWheel);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [
    getCanvasPoint,
    scheduleRedraw,
    zoomIn,
    zoomOut,
    isPanning,
    currentToolRef,
    isDownPressed,
  ]);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
      <canvas
        ref={canvasRef}
        style={canvasStyle}
        onPointerDown={(e) => {
          SetIsMouseDown(true);
          handlePointerDown(e);
        }}
        onPointerUp={(e) => {
          SetIsMouseDown(false);
          handlePointerUp(e);
        }}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerUp}
      />
    </div>
  );
}

export default CanvasDraw;
