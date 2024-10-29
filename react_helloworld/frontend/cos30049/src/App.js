// src/App.js
import React from 'react';
import Navbar from './components/Navbar';
import Body from './components/Body';
import Footer from './components/Footer';
import './App.css'; // Import the global CSS

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <Body />
      <Footer />
    </div>
  );
}

export default App;
