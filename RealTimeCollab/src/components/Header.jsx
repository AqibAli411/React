import Link from "./Link";
import Links from "./Links";

// bg-[radial-gradient(theme('colors.stone.200')_1.5px,transparent_0px),radial-gradient(theme('colors.stone.200')_1.5px,transparent_0px),linear-gradient(to_100%_100%, theme('color.stone.300'), theme('color.stone.200'), theme('color.stone.500'))] 

function Header() {
  return (
    <header className="mx-auto my-2 flex max-w-320 items-center justify-between p-2 text-stone-950">
      <div className="flex gap-2 items-center justify-center">
        <div className="w-10 h-10 bg-blue-500 p-1 rounded-xl">
          <img src="/icon.svg"/>
        </div>
        <div className="font-semibold">RealScribe</div>
      </div>
      
      <Links />
    </header>
  );
}

export default Header;
