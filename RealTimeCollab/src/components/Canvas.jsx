import CanvasManager from "../features/DrawingCanvas/CanvasManager";
import DrawOptions from "./DrawOptions";

function Canvas() {
  return (
    <div className="flex-3 border-1 relative">
      <DrawOptions />
      <CanvasManager />
    </div>
  );
}

export default Canvas;
