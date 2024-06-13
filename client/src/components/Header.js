// Header.js not being used

import React from 'react';
import { Link } from 'react-router-dom';
import './components.css';

const Header = () => {
  return (
    <header className="header">
      <nav className="navbar">
        <ul className="nav-left">
          <li>
            <Link to="/countries">Countries</Link>
          </li>
        </ul>
        <ul className="nav-right">
          <li>
            <Link to="/login">Login</Link>
          </li>
          {/* Add more navigation links as needed */}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
