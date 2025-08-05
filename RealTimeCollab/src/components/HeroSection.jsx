import Heading from "./Heading";

function HeroSection() {
  return (
    <section className="flex flex-col items-center justify-center gap-10 text-stone-950">
      <div className="h-[150px] w-[150px] bg-blue-500 mask-[url('/connection.svg')] mask-contain mask-center mask-no-repeat" />

      <Heading />
      <div className="">
        <p>Efficiently manage your tasks and boost productivity</p>
      </div>
      <div className="rounded-md bg-blue-500 px-4 py-2 font-medium text-stone-100">
        <a>Get free demo</a>
      </div>
    </section>
  );
}

export default HeroSection;
