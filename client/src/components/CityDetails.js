// src/components/CityDetails.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import isTokenExpired from './IsTokenExpired';

const CityDetails = () => {
  const { countryId, cityId } = useParams();
  const [city, setCity] = useState(null);
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken');
  const [errorMessage, setErrorMessage] = useState('');

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
    navigate(`/countries/${countryId}/cities/${cityId}/edit`);
  };

  const handleDeleteClick = async () => {

  try {

  const confirmed = window.confirm('Are you sure you want to delete this city?');

      if (!confirmed) {
        // If the user cancels the operation, do nothing
        return;
      }
      let accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      const isAccessTokenExpired = isTokenExpired(accessToken);
      const isRefreshTokenExpired = isTokenExpired(refreshToken);

      if (isAccessTokenExpired) {
        const response = await axios.post(
          'https://oyster-app-4bwlf.ondigitalocean.app/api/accessToken',
          {
            refreshToken: localStorage.getItem('refreshToken'),
          }
        );

        if (response && response.data) {
          accessToken = response.data.accessToken;
          localStorage.setItem('accessToken', accessToken);
        } else {
          console.error('Error refreshing token:', response);
          return;
        }
      }

      await axios.delete(`https://oyster-app-4bwlf.ondigitalocean.app/api/countries/${countryId}/cities/${cityId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      navigate(`/countries/${countryId}/cities`);
  } catch (error) {
    console.error('Error deleting :', error);

    if (error.response && error.response.status === 422) {
      // Handle validation errors
      const validationErrors = error.response.data.errors;
      const errorMessage = Object.values(validationErrors).flat().join(', ');
      setErrorMessage(errorMessage);
    } else if (error.response && error.response.status === 403){
      setErrorMessage("unauthorized");
    } else {

      // Handle other types of errors
      const errorMessage = error.response ? error.response.data.message : error.message;
      setErrorMessage(errorMessage);
    }
  }
};

  if (!city) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1>{city.name}</h1>
      <p>{city.description}</p>
      {accessToken && (<button class="left-aligned-button" onClick={handleEditClick}>Edit</button>)}
      {accessToken && (<button class="right-aligned-button" onClick={handleDeleteClick}>Delete</button>)}
      {errorMessage && ( <p style={{ color: 'red' }}>{errorMessage}</p> )}
    </div>
  );
};

export default CityDetails;
