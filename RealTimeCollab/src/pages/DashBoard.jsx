import ChatSection from "../components/ChatSection";
import ModeHeader from "../components/ModeHeader";
import { useState } from "react";
import SimpleEditor from "../features/TextEditor/components/tiptap-templates/simple/simple-editor.jsx";
import { useParams, useSearchParams } from "react-router-dom";
import CanvasManager from "../features/DrawingCanvas/CanvasManager.jsx";

//component gets unmounted data gets lost -> we don't want that

function DashBoard() {
  const [mode, setMode] = useState("canvas"); // 'canvas' or 'text'
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { roomId } = useParams(); // URL me /room/123 ho to id = "123"

  const [searchParams] = useSearchParams();
  const name = searchParams.get("name");
  const id = searchParams.get("id");

  // todo:
  // -> username,roomId,type and payload -> send to server to broadcast
  // -> roomId -> url (useParam)
  // -> username -> i could lift up
  //

  return (
    <section className="mx-auto mt-2 flex max-w-[1330px] flex-col border border-gray-300 shadow-xs">
      <ModeHeader
        onSetMode={setMode}
        mode={mode}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        roomId={roomId}
        name={name}
      />
      <div className="flex h-[550px] justify-between">
        <ChatSection />
        <div
          className={`relative flex-3 ${mode === "canvas" ? "block" : "hidden"}`}
        >
          <CanvasManager isDarkMode={isDarkMode} roomId={roomId} id={id} />
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
