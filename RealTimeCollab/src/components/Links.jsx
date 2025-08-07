import Link from "./Link";

function Links() {
  return (
    <>
      <ul className="flex items-center justify-center gap-8">
        {["Features", "Solutions", "Resources", "Pricing"].map((item, i) => (
          <Link key={i}>{item}</Link>
        ))}
      </ul>

      <ul className="flex items-center justify-center gap-6">
        <Link>Sign in</Link>
        {/* <Link className="gradient-border text-black px-4 py-2 rounded-xl">
          Get demo
        </Link> */}
        <Link className="rounded-md bg-blue-500 px-4 py-2 font-medium text-stone-100">
          Join Now
        </Link>
      </ul>
    </>
  );
}

export default Links;
