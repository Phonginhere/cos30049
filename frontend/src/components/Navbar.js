import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <nav className="navbar px-4">
        <h2 className="navbar-brand">Safety Windy</h2>

        {/* Desktop Links */}
        <div className="desktop-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/graph" className="nav-link">Graph</Link>
        </div>

        {/* Mobile Toggle Button */}
        <button className="navbar-toggler" onClick={toggleNavbar}>
          <span className="navbar-toggler-icon"></span>
        </button>
      </nav>

      {/* Sidebar Menu for Mobile */}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <button className="close-btn" onClick={toggleNavbar}>×</button>
        <ul>
          <li><Link to="/" onClick={toggleNavbar}>Home</Link></li>
          <li><Link to="/graph" onClick={toggleNavbar}>Graph</Link></li>
        </ul>
      </div>

      {/* Overlay for the sidebar when open on mobile */}
      {isOpen && <div className="overlay" onClick={toggleNavbar}></div>}
    </div>
  );
}

export default Navbar;
