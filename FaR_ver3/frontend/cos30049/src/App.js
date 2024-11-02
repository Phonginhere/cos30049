import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';


import HomePage from './pages/HomePage';
import GraphPage from './pages/GraphPage';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <div className="content">
          <div className="container my-5">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/graph" element={<GraphPage />} />
            </Routes>
          </div>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
