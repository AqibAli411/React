//Thought process

/* 

drawLiveStroke this method draws the stroke points -> live and old both ones
we need this method to run by subscriber method so it gets to each client at the same time
we define a method in here that gets passed to useWebSocket hook that will call it upon reciving the points


*/

import { useRef, useEffect, useCallback } from "react";
import { getStroke } from "perfect-freehand";
import useWebSocket from "./useWebSocket";

const options = {
  size: 2.1,
  thinning: -0.99,
  smoothing: 0.2,
  streamline: 0.25,
  easing: (t) => t,
  start: { taper: 0, easing: (t) => t },
  end: { taper: 0, easing: (t) => t },

};


function getSvgPathFromStroke(strokePoints) {
  if (!strokePoints.length) return "";
  const d = strokePoints
    .map(
      ([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`
    )
    .join(" ");
  return d + " Z";
}

export default function DrawingBoard() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const isDrawing = useRef(false); //only draw when pointer is down
  const currentStroke = useRef([]);
  const allStrokes = useRef([]); // array of strokes

  const drawLiveStroke = useCallback(() => {
    const ctx = ctxRef.current;
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Draw all past strokes

    for (const stroke of allStrokes.current) {
      //gets each of past strokes and draw them
      const path = new Path2D(getSvgPathFromStroke(getStroke(stroke, options)));
      ctx.fill(path);
    }

    // Draw current stroke in progress
    if (currentStroke.current.length > 0) {
      const path = new Path2D(
        getSvgPathFromStroke(getStroke(currentStroke.current, options))
      );
      ctx.fill(path);
    }
  }, []);

  const onDraw = useCallback(
    (message) => {
      console.log(message);
      //this will be executed when point returns
      //if user is drawing then it is a point if not then it is currStroke
      const { x, y, pressure } = JSON.parse(message.body);
      currentStroke.current.push([x, y, pressure]);

      requestAnimationFrame(drawLiveStroke);
    },
    [drawLiveStroke]
  );

  const onStop = useCallback(
    (message) => {
      currentStroke.current = [];
      const { currentStrokes } = JSON.parse(message.body);
      allStrokes.current.push(currentStrokes);

      requestAnimationFrame(drawLiveStroke);
    },
    [drawLiveStroke]
  );

  const { client } = useWebSocket(onDraw, onStop);

  //runs on inital mount
  //fills the ctxRef and canvasRef
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctxRef.current = ctx;

    // Setup canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.fillStyle = "#000";
    ctx.strokeStyle = "#000000";
    ctx.fillStyle = "#000000";
    ctx.shadowColor = "rgba(0,0,0,0)";
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
  }, []);

  const handlePointerDown = function (e) {
    isDrawing.current = true;

    client.publish({
      destination: "/app/draw.points",
      body: JSON.stringify({
        x: e.clientX,
        y: e.clientY,
        pressure: e.pressure || 0.5,
      }),
    });
  };

  const handlePointerMove = function (e) {
    if (!isDrawing.current) return;

    client.publish({
      destination: "/app/draw.points",
      body: JSON.stringify({
        x: e.clientX,
        y: e.clientY,
        pressure: e.pressure || 0.5,
      }),
    });
  };

  const handlePointerUp = () => {
    isDrawing.current = false;

    if (currentStroke.current.length > 0) {
      //when user stops clicking then currentStroke (current path drawn by user) ends
      //therefore save it to the total strokes recorded
      console.log("here inside up");
      client.publish({
        destination: "/app/add.strokes",
        body: JSON.stringify({
          currentStrokes: currentStroke.current,
        }),
      });
    }
  };

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100vw",
        height: "100vh",
        display: "inline-block",
        touchAction: "none",
        background: "#fff",
        cursor: 'crosshair'
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    />
  );
}
