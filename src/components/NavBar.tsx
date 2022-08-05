import { NavLink, useLocation } from "react-router-dom";
import "./NavBar.scss";
interface Props {
  account: string | null;
  web3Handler: () => Promise<void>;
}

function NavBar({ web3Handler, account }: Props) {
  const location = useLocation();

  return (
    <nav>
      <h1>NFT Marketplace</h1>
      <ul>
        <NavLink
          className={`nav-link ${
            location.pathname === "/" ? "active-link" : ""
          }`}
          to={"/"}
        >
          Home
        </NavLink>
        <NavLink
          className={`nav-link ${
            location.pathname === "/purchase" ? "active-link" : ""
          }`}
          to={"/purchase"}
        >
          Purchase
        </NavLink>
        <NavLink
          className={`nav-link ${
            location.pathname === "/create" ? "active-link" : ""
          }`}
          to={"/create"}
        >
          Create
        </NavLink>
        <NavLink
          className={`nav-link ${
            location.pathname === "/listed" ? "active-link" : ""
          }`}
          to={"/listed"}
        >
          Listed
        </NavLink>
        {account ? (
          <button className="btn acc-btn">
            {account.slice(0, 5) + "..." + account.slice(38, 42)}
          </button>
        ) : (
          <button className="btn connect-btn" onClick={web3Handler}>
            Connect Wallet
          </button>
        )}
      </ul>
    </nav>
  );
}

export default NavBar;
