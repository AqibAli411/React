import { Link } from "react-router-dom"
import SearchOrder from "../features/order/SearchOrder"

function Header() {
    return (
        <header>
            <Link to='/'>Back to home</Link>
            <SearchOrder />
        </header>
    )
}

export default Header
