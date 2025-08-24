import Links from "./Links";

function Header() {
  return (
    <header className="p-10">
      <div className="fixed top-0 right-0 left-0 z-99 mx-auto flex w-340 items-center justify-between  bg-white/90 p-4 backdrop-blur-lg">
        <div className="flex items-center justify-center gap-2">
          <div className="h-10 w-10 rounded-xl bg-blue-500 p-1">
            <img src="/icon.svg" />
          </div>
          <div className="font-semibold">RealScribe</div>
        </div>

        <Links />
      </div>
    </header>
  );
}

export default Header;
