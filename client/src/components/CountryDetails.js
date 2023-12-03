// src/components/CountryDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const CountryDetails = () => {
  const { countryId } = useParams();
  const [country, setCountry] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://oyster-app-4bwlf.ondigitalocean.app/api/countries/${countryId}`);
        setCountry(response.data);
      } catch (error) {
        console.error(`Error fetching country with ID ${countryId}:`, error);
      }
    };

    fetchData();
  }, [countryId]);

  if (!country) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{country.name}</h1>
      <p>{country.description}</p>
    </div>
  );
};

export default CountryDetails;
