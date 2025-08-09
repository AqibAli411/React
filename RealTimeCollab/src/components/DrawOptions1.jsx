import { EraserIcon, PencilLine } from "lucide-react";

function DrawOptions() {
  return (
    <div className="flex items-center justify-between border-1 p-2">
      <div className="flex flex-3 justify-between">
        <div className="flex items-center gap-4 px-2">
          <EraserIcon />
          <PencilLine />
          <input
            type="color"
            className="h-8 w-8 border-0 p-0"
            title="Pen color"
          />
          <div className="flex items-center gap-2">
            <input type="range" min="1" max="40" />
            <div className="w-8 text-center text-xs">34</div>
          </div>
        </div>

        <div className="ml-3 hidden items-center gap-2 sm:flex mx-[31px]">
          <button className="rounded-md bg-gray-100 px-3 py-1 text-sm">
            Undo
          </button>
          <button className="rounded-md bg-gray-100 px-3 py-1 text-sm">
            Redo
          </button>

          <button className="rounded-md bg-indigo-500 px-3 py-1 text-sm text-white">
            Save
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs text-gray-950">Zoom: 100%</div>
        </div>
      </div>
    </div>
  );
}

export default DrawOptions;
