// src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';

import CountryList from './components/CountryList';
import CountryDetails from './components/CountryDetails';
import CountryEdit from './components/CountryEdit';
import CountryCreate from './components/CountryCreate';
import CityList from './components/CityList';
import CityDetails from './components/CityDetails';
import CityCreate from './components/CityCreate';
import CityEdit from './components/CityEdit';
import PlaceList from './components/PlaceList';
import PlaceDetails from './components/PlaceDetails';
import PlaceCreate from './components/PlaceCreate';
import PlaceEdit from './components/PlaceEdit';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import AboutUs from './components/AboutUs';

const App = () => {
  const storedUsername = localStorage.getItem('username');
  const accessToken = localStorage.getItem('accessToken');
const toggleMenu = () => {
  const navbarLinks = document.querySelector('.navbar-links');
  if (navbarLinks) {
    navbarLinks.style.display = navbarLinks.style.display === 'none' ? 'flex' : 'none';
  }
};


return (
    <Router>
      <div>
        <header>
          <nav className="navbar">
            <div className="menu-toggle" onClick={toggleMenu}>
              &#9776; {/* Hamburger icon */}
            </div>
            <ul className="navbar-links">
              <li>
                <Link to="/home">
                  <FontAwesomeIcon icon={faGlobe} style={{ fontSize: '2em' }} />
                </Link>
              </li>
              <li>
                <Link to="/countries">Countries</Link>
              </li>

              {accessToken && (
                <li >
                  <p id="loggedInMessage">Logged in as {storedUsername}</p>
                </li>
              )}
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>

            </ul>

          </nav>
        </header>


        <Routes>
          <Route path="/countries/:countryId/cities/:cityId/places/:placeId/edit" element={<PlaceEdit />} />
          <Route path="/countries/:countryId/cities/:cityId/places/new" element={<PlaceCreate />} />
          <Route path="/countries/:countryId/cities/:cityId/places/:placeId" element={<PlaceDetails />} />
          <Route path="/countries/:countryId/cities/:cityId/places" element={<PlaceList />} />
          <Route path="/countries/:countryId/cities/:cityId/edit" element={<CityEdit />} />
          <Route path="/countries/:countryId/cities/new" element={<CityCreate />} />
          <Route path="/countries/:countryId/cities/:cityId" element={<CityDetails />} />
          <Route path="/countries/:countryId/cities" element={<CityList />} />
          <Route path="/countries/:countryId/edit" element={<CountryEdit />} />
          <Route path="/countries/:countryId" element={<CountryDetails />} />
          <Route path="/countries/new" element={<CountryCreate />} />
          <Route path="/countries" element={<CountryList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
        </Routes>
        <footer>
          <p> KTU 2023</p>
          <Link to="/about" className="footer-link">About us</Link>
        </footer>
      </div>
    </Router>
  );
};

export default App;