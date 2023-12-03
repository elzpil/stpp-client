// src/components/CountryList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CountryList = () => {
  const [countries, setCountries] = useState([]);

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
    <div>
      <h1>Country List</h1>
      <ul>
        {countries.map((country) => (
          <li key={country.id}>
            <strong>{country.name}</strong> - {country.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CountryList;
