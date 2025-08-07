import Heading from "./Heading";

function HeroSection() {
  return (
    <section className="flex flex-1 flex-col items-start justify-center gap-6 ps-6 text-stone-950">
      <Heading />
      <div className="">
        <p>
          Real-time co-editing that turns solo drafts into team masterpieces.
        </p>
      </div>
      <div className="gradient-border ml-[-26px] self-center rounded-xl px-4 py-2 font-medium">
        <a>Join Now</a>
      </div>
    </section>
  );
}

export default HeroSection;
