import { ThemeToggle } from "@/components/tiptap-templates/simple/theme-toggle";

function ModeHeader({ mode, onSetMode, isDarkMode, setIsDarkMode }) {
  return (
    <header className="flex justify-between border-b border-gray-300 bg-white p-2 dark:border-gray-700 dark:bg-neutral-900">
      {/* Logo Section */}
      <div className="flex items-center justify-center gap-2">
        <div className="h-10 w-10 rounded-xl bg-blue-500 p-1 dark:bg-blue-600">
          <img src="/icon.svg" alt="RealScribe" />
        </div>
        <div className="font-semibold text-gray-900 dark:text-white">
          RealScribe
        </div>
      </div>

      {/* Mode Toggle Section */}
      <div className="ml-4 hidden items-center gap-2 md:flex">
        <span className="text-sm text-gray-500 dark:text-gray-400">Mode</span>
        <div className="flex items-center gap-1 rounded-full bg-gray-100 p-1 dark:bg-gray-800">
          <button
            onClick={() => onSetMode("canvas")}
            className={`rounded-full px-3 py-1 text-sm transition-colors ${
              mode === "canvas"
                ? "bg-white text-gray-900 shadow dark:bg-blue-500 dark:text-white"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            Canvas
          </button>
          <button
            onClick={() => onSetMode("text")}
            className={`rounded-full px-3 py-1 text-sm transition-colors ${
              mode === "text"
                ? "bg-white text-gray-900 shadow dark:bg-blue-500 dark:text-white"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            Text
          </button>
        </div>
      </div>

      {/* User Profile Section */}
      <div className="flex items-center gap-3">
        <ThemeToggle isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        <div className="flex items-center gap-2">
          <div className="hidden text-sm text-gray-800 sm:block dark:text-gray-200">
            Aqib Ali
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 font-semibold text-blue-50 dark:from-blue-500 dark:to-blue-700">
            AA
          </div>
        </div>
      </div>
    </header>
  );
}

export default ModeHeader;
