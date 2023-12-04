// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import CountryList from './components/CountryList';
import CountryDetails from './components/CountryDetails';
import CountryEdit from './components/CountryEdit';
import CountryCreate from './components/CountryCreate';
import CityList from './components/CityList';
import CityDetails from './components/CityDetails';
import PlaceList from './components/PlaceList';
import PlaceDetails from './components/PlaceDetails';
import Login from './components/Login';
import Register from './components/Register';

const App = () => {
  return (
    <Router>
      <div>
        <header>
                  {/* Add a navigation link to CountryList */}
                  <nav className="navbar">
                    <ul>
                      <li>
                        <Link to="/">Main</Link>
                      </li>
                    </ul>
                    <ul>
                      <li>
                        <Link to="/countries">Countries</Link>
                      </li>
                    </ul>
                    <ul className="right">
                      <li>
                        <Link to="/login">Login</Link>
                      </li>
                        <li>
                         <Link to="/register">Register</Link>
                        </li>
                    </ul>
                  </nav>
                </header>

        {/* Define your routes */}
        <Routes>
          <Route path="/countries/:countryId/cities/:cityId/places/:placeId" element={<PlaceList />} />
          <Route path="/countries/:countryId/cities/:cityId/places" element={<PlaceList />} />
          <Route path="/countries/:countryId/cities/:cityId" element={<CityDetails />} />
          <Route path="/countries/:countryId/cities" element={<CityList />} />
          <Route path="/countries/:countryId/edit" element={<CountryEdit />} />
          <Route path="/countries/:countryId" element={<CountryDetails />} />
          <Route path="/countries/new" element={<CountryCreate />} />
          <Route path="/countries" element={<CountryList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Add more routes as needed */}
        </Routes>
        <footer>
          <p> KTU 2023</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;