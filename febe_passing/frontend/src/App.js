// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Profile from './components/Profile';
import RegisterForm from './components/RegisterForm';

function App() {
  return (
    <Router>
      <div style={styles.container}>
        <nav style={styles.nav}>
          <ul style={styles.ul}>
            <li style={styles.li}>
              <Link to="/">Profile</Link>
            </li>
            <li style={styles.li}>
              <Link to="/register">Register</Link>
            </li>
          </ul>
        </nav>

        <div style={styles.content}>
          <Routes>
            <Route path="/" element={<Profile />} />
            <Route path="/register" element={<RegisterForm />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
  },
  nav: {
    backgroundColor: '#f0f0f0',
    padding: '10px',
  },
  ul: {
    listStyleType: 'none',
    display: 'flex',
    gap: '20px',
    margin: 0,
    padding: 0,
  },
  li: {
    display: 'inline',
  },
  content: {
    padding: '20px',
  },
};

export default App;
