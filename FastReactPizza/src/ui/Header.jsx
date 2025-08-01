import { Link } from "react-router-dom";
import SearchOrder from "../features/order/SearchOrder";
import Username from "../features/user/Username";

function Header() {
  return (
    <header className="bg-yellow-500 uppercase border-b border-stone-200 
    px-4 py-3">
      <Link to="/" className="tracking-widest">
        Back to home
      </Link>
      <SearchOrder />
      <Username />
    </header>
  );
}

export default Header;
