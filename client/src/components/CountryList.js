// src/components/CountryList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const CountryList = () => {
  const [countries, setCountries] = useState([]);
  const accessToken = localStorage.getItem('accessToken'); // Get access token from localStorage

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://oyster-app-4bwlf.ondigitalocean.app/api/countries');
        setCountries(response.data);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="list-container">
      <h1>Country List</h1>

      {/* Conditionally render the button based on the existence of the access token */}
      {accessToken && (
        <Link to="/countries/new">
          <button>Create New Country</button>
        </Link>
      )}

      <table className="custom-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Cities</th>
          </tr>
        </thead>
        <tbody>
          {countries.map((country) => (
            <tr key={country.id}>
              <td>
                {/* Make the country name a link */}
                <Link to={`/countries/${country.id}`}>{country.name}</Link>
              </td>
              <td>{country.description}</td>
              <td>


                  <Link to={`/countries/${country.id}/cities`}>Cities</Link>

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CountryList;
