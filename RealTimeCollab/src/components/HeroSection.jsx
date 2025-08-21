import Heading from "./Heading";
import { Link } from "react-router-dom";

function HeroSection() {
  return (
    <section className="flex flex-col items-start justify-center gap-2 p-12 text-stone-950">
      <Heading />
      <div className="text-stone-700">
        <p>
          Real-time co-editing that turns solo drafts into team masterpieces.
        </p>
      </div>
      <div className="mt-6 flex gap-3">
        <Link
          to="room"
          className="flex transform items-center justify-center rounded-xl bg-blue-500 px-6 py-3 font-medium text-stone-100 transition-all duration-100 hover:-translate-y-[0.5px] hover:scale-101 hover:bg-blue-600"
        >
          Join Room
        </Link>
        <Link
          to="room"
          className="gradient-border rounded-xl px-6 py-3 font-medium transition-all duration-100 hover:-translate-y-[0.5px] hover:scale-101 hover:bg-blue-600"
        >
          Create Room
        </Link>
      </div>
    </section>
  );
}

export default HeroSection;
