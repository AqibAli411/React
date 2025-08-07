import AiSection from "../components/AiSection";
import Canvas from "../components/Canvas";
import ChatSection from "../components/ChatSection";
import Options from "../components/Options";

function DashBoard() {
  return (
    <section className="flex flex-col border-1 max-w-[1300px] mx-auto">
      <Options />
      <div className="flex  justify-between ">
        <ChatSection />
        <Canvas />
        {/* <AiSection /> */}
      </div>
    </section>
  );
}

export default DashBoard;
