import React from 'react';
import '../stylesheets/header.css'; 

function Header() {
  return (
    <header className="header">
      <div className="blue-line"></div>
      <div className="header-content">
        <h1 className="site-name">BuildResume</h1>
        <div className="nav-buttons">
          <button>Resume</button>
          <button>Feedboard</button>
          <button className="login-button">Login</button>
        </div>
      </div>
    </header>
  );
}

export default Header;
