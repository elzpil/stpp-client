// src/components/CityDetails.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';

const CityDetails = () => {
  const { countryId, cityId } = useParams();
  const [city, setCity] = useState(null);
  const navigate = useNavigate();

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
  const handleEditClick = () => {
    // Navigate to the edit page
    navigate(`/countries/${countryId}/cities/${cityId}/edit`);
  };

  const handleDeleteClick = async () => {
    try {
      // Send a DELETE request to the country endpoint
      await axios.delete(`https://oyster-app-4bwlf.ondigitalocean.app/api/countries/${countryId}/cities/${cityId}`);
      // Redirect to the countries list or another page after deletion
      navigate('/countries/${countryId}/cities');
    } catch (error) {
      console.error(`Error deleting city with ID ${cityId}:`, error);
    }
  };
  if (!city) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1>{city.name}</h1>
      <p>{city.description}</p>
      <button class="left-aligned-button" onClick={handleEditClick}>Edit</button>
      <button class="right-aligned-button" onClick={handleDeleteClick}>Delete</button>
    </div>
  );
};

export default CityDetails;
