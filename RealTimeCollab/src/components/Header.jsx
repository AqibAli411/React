import Link from "./Link";
import Links from "./Links";

function Header() {
  return (
    <header className="mx-8 flex items-center justify-between p-2">
      <div className="flex gap-0.75">
        <div>Logo</div>
        <div>Real Time</div>
      </div>

      <Links />
    </header>
  );
}

export default Header;
