import { Link } from "react-router-dom";
import { APP } from "../config/constants";

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="wrap header-row">
        <Link className="brand" to="/">
          <span className="brand-mark" aria-hidden="true">
            {APP.mark}
          </span>
          <span>
            <strong>{APP.name}</strong>
            <span className="brand-sub">{APP.tagline}</span>
          </span>
        </Link>
        <nav className="header-nav" aria-label="Main">
          <a href="#catalog">Templates</a>
          <a href="#flow">How it works</a>
        </nav>
      </div>
    </header>
  );
}
