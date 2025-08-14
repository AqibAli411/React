import Heading from "./Heading";
import { Link } from "react-router-dom";


function HeroSection() {
  return (
    <section className="flex flex-1 flex-col items-start justify-center gap-6 ps-6 text-stone-950">
      <Heading />
      <div className="">
        <p>
          Real-time co-editing that turns solo drafts into team masterpieces.
        </p>
      </div>
      <div className="-ml-20 flex gap-2 self-center">
        <div className="gradient-border self-center rounded-xl px-4 py-2 font-medium">
          <Link to="room">Join Room</Link>
        </div>
        <div className="gradient-border self-center rounded-xl px-4 py-2 font-medium">
          <Link to="room">Create Room</Link>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
