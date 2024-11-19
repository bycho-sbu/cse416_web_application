// Header.js
import { Link } from 'react-router-dom';
import '../stylesheets/header.css';

function Header() {
  return (
    <header className="header">
      <div className="blue-line"></div>
      <div className="header-content">
        <h1 className="site-name">
            <Link to="/">
                BuildResume
            </Link>
        </h1>
        <div className="nav-buttons">
          <Link to="/resume-editor">
            <button>Resume</button>
          </Link>
          <Link to="/feedboard">
            <button>Feedboard</button>
          </Link>
          <Link to="/login">
            <button className="login-button">Login</button>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;