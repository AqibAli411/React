import { EraserIcon, PencilLine } from "lucide-react";
import MultiLines from "../utils/MultiLines";
import { useState } from "react";

function DrawOptions() {
  const [onClickChangeWidth, setOnClickChangeWidth] = useState(false);
  const [penWidth, setPenWidth] = useState(4);
  return (
    <div className="absolute top-2.5 right-10 flex items-center justify-center gap-3 rounded-xl bg-stone-50 p-2 shadow-xl">
      <div className="rounded-xl p-2 text-stone-600 transition-all hover:bg-blue-100">
        <PencilLine />
      </div>

      <div className="rounded-xl p-2 text-stone-600 transition-all hover:bg-blue-100">
        <EraserIcon />
      </div>

      <div className="relative">
        <div
          className="rounded-xl p-2 hover:bg-blue-100"
          onClick={() => setOnClickChangeWidth(!onClickChangeWidth)}
        >
          <MultiLines />
        </div>
        {onClickChangeWidth && (
          <div className="absolute top-15 left-0 transform-[translateX(-55%)] rounded-xl bg-white p-4 shadow-md">
            <div> Weight </div>

            <div className="flex items-center justify-center gap-3">
              <input
                type="range"
                min="0"
                max="40"
                value={penWidth}
                onChange={(e) => setPenWidth(Number(e.target.value))}
              />

              <div className="rounded-sm border border-blue-500 p-2">
                {penWidth}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="h-8 w-8">
        <input
          className="h-full w-full appearance-none border-none"
          type="color"
        />
      </div>
    </div>
  );
}

export default DrawOptions;
