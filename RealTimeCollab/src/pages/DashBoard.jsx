import AiSection from "../components/AiSection";
import Canvas from "../components/Canvas";
import ChatSection from "../components/ChatSection";
import ModeHeader from "../components/ModeHeader";
import Options from "../components/DrawOptions";

function DashBoard() {
  return (
    <section className="mx-auto flex max-w-[1330px] flex-col border-1 mt-2">
      <ModeHeader />
      <div className="flex justify-between">
        <ChatSection />
        <Canvas />
        {/* <AiSection /> */}
      </div>
    </section>
  );
}

export default DashBoard;
