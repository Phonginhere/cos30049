import React from 'react';
import CustomNavbar from './Navbar';

function Header() {
  return (
    <div>
      <CustomNavbar />
      <header className="bg-dark text-white p-4 text-center">
        <h1>COS30049 - Computing Technology Innovation Project</h1>
        <h2>Air Quality and Its Impact on Health</h2>
        <h3>Team 29 - Safety Windy</h3>
      </header>
    </div>
  );
}

export default Header;
