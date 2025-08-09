import { MoonIcon, SunIcon } from "lucide-react";
import { useState } from "react";

function ModeHeader() {
  const [mode, setMode] = useState("canvas"); // 'canvas' or 'text'
  const [dark, setDark] = useState(false);

  const toggleTheme = () => setDark((s) => !s);
  return (
    <header className="flex justify-between p-2">
      <div className="flex items-center justify-center gap-2">
        <div className="h-10 w-10 rounded-xl bg-blue-500 p-1">
          <img src="/icon.svg" />
        </div>
        <div className="font-semibold">RealScribe</div>
      </div>

      <div className="ml-4 hidden items-center gap-2 md:flex">
        <span className="text-sm text-gray-500">Mode</span>
        <div className="flex items-center gap-1 rounded-full bg-gray-100 p-1">
          <button
            onClick={() => setMode("canvas")}
            className={`rounded-full px-3 py-1 text-sm ${mode === "canvas" ? "bg-white shadow" : "text-gray-500"}`}
          >
            Canvas
          </button>
          <button
            onClick={() => setMode("text")}
            className={`rounded-full px-3 py-1 text-sm ${mode === "text" ? "bg-white shadow" : "text-gray-500"}`}
          >
            Text
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="rounded-md p-2 hover:bg-gray-100"
        >
          {dark ? <MoonIcon /> : <SunIcon />}
        </button>

        <div className="flex items-center gap-2">
          <div className="hidden text-sm text-gray-800 sm:block">Aqib Ali</div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 font-semibold text-blue-50">
            AA
          </div>
        </div>
      </div>
    </header>
  );
}

export default ModeHeader;
