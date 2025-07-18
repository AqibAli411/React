import {  NavLink } from "react-router-dom";
import styles from "./PageNav.module.css";
import Logo from "../components/Logo";

//we can also use NavLinks here to just get an active class on the url being visited
//helpfull when we want something tobe marked when visited..

function PageNav() {
  return (
    <nav className={styles.nav}>
      <Logo />

      <ul>
        <li>
          <NavLink to="/product">product</NavLink>
        </li>
        <li>
          <NavLink to="/pricing">pricing</NavLink>
        </li>
        <li>
          <NavLink to="/login" className={styles.ctaLink}>Login in</NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default PageNav;
