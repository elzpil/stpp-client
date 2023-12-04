// src/components/CityDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const CityDetails = () => {
  const { countryId, cityId } = useParams();
  const [city, setCity] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://oyster-app-4bwlf.ondigitalocean.app/api/countries/${countryId}/cities/${cityId}`);
        setCity(response.data);
      } catch (error) {
        console.error(`Error fetching city with ID ${cityId} in country ${countryId}:`, error);
      }
    };

    fetchData();
  }, [countryId, cityId]);

  if (!city) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1>{city.name}</h1>
      <p>{city.description}</p>
    </div>
  );
};

export default CityDetails;
