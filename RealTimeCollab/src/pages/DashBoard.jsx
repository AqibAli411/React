import Canvas from "../components/Canvas";
import ChatSection from "../components/ChatSection";
import ModeHeader from "../components/ModeHeader";
import { useState } from "react";
import SimpleEditor from "../features/TextEditor/components/tiptap-templates/simple/simple-editor.jsx";

//component gets unmounted data gets lost -> we don't want that

function DashBoard() {
  const [mode, setMode] = useState("canvas"); // 'canvas' or 'text'
  const [isDarkMode, setIsDarkMode] = useState(null);

  return (
    <section className="mx-auto mt-2 flex max-w-[1330px] flex-col border border-gray-300 shadow-xs">
      <ModeHeader
        onSetMode={setMode}
        mode={mode}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />
      <div className="flex h-[550px] justify-between">
        <ChatSection />
        <div
          className={`relative flex-3 ${mode === "canvas" ? "block" : "hidden"}`}
        >
          <Canvas isDarkMode={isDarkMode}/>
        </div>

        <div
          className={`${mode === "text" ? "block" : "hidden"} flex-3 overflow-auto`}
        >
          <div className={`simple-editor-wrapper`}>
            <SimpleEditor />
          </div>
        </div>
      </div>
    </section>
  );
}

export default DashBoard;
