import { NavLink, useLocation } from "react-router-dom";
import "./NavBar.scss";

function NavBar() {
  const location = useLocation();

  return (
    <nav>
      <h1>NFT Marketplace</h1>
      <ul>
        <NavLink
          className={`nav-link ${
            location.pathname == "/" ? "active-link" : ""
          }`}
          to={"/"}
        >
          Home
        </NavLink>
        <NavLink
          className={`nav-link ${
            location.pathname == "/purchase" ? "active-link" : ""
          }`}
          to={"/purchase"}
        >
          Purchase
        </NavLink>
        <NavLink
          className={`nav-link ${
            location.pathname == "/create" ? "active-link" : ""
          }`}
          to={"/create"}
        >
          Create
        </NavLink>
        <NavLink
          className={`nav-link ${
            location.pathname == "/listed" ? "active-link" : ""
          }`}
          to={"/listed"}
        >
          Listed
        </NavLink>
      </ul>
    </nav>
  );
}

export default NavBar;
