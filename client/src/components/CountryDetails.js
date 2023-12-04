// src/components/CountryDetails.js
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CountryDetails = () => {
  const { countryId } = useParams();
  const [country, setCountry] = useState(null);
  const navigate = useNavigate();

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

  const handleEditClick = () => {
    // Navigate to the edit page
    navigate(`/countries/${countryId}/edit`);
  };

  const handleDeleteClick = async () => {
    try {
      // Send a DELETE request to the country endpoint
      await axios.delete(`https://oyster-app-4bwlf.ondigitalocean.app/api/countries/${countryId}`);
      // Redirect to the countries list or another page after deletion
      navigate('/countries');
    } catch (error) {
      console.error(`Error deleting country with ID ${countryId}:`, error);
    }
  };

  if (!country) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1>{country.name}</h1>
      <p>{country.description}</p>
      <button onClick={handleEditClick}>Edit</button>
      <button onClick={handleDeleteClick}>Delete</button>
    </div>
  );
};

export default CountryDetails;

