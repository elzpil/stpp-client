import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const CountryList = () => {
  const [countries, setCountries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const accessToken = localStorage.getItem('accessToken'); // Get access token from localStorage

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://localhost:7036/api/countries');
        setCountries(response.data);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container">
      <h1>Country List</h1>

      {/* Search input field */}
      <input
        type="text"
        placeholder="Search countries..."
        value={searchQuery}
        onChange={handleSearchChange}
      />
      <br />
      <br />
      {/* Conditionally render the button based on the existence of the access token */}
      {accessToken && (
        <Link to="/countries/new">
          <button>Create New Country</button>
        </Link>
      )}

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Cities</th>
          </tr>
        </thead>
        <tbody>
          {filteredCountries.map((country) => (
            <tr key={country.id}>
              <td>
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
