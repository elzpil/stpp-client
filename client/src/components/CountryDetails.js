// src/components/CountryDetails.js
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import isTokenExpired from './IsTokenExpired';

const CountryDetails = () => {
  const { countryId } = useParams();
  const [country, setCountry] = useState(null);
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken');
  const [errorMessage, setErrorMessage] = useState('');

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

  const confirmed = window.confirm('Are you sure you want to delete this country?');

      if (!confirmed) {
        // If the user cancels the operation, do nothing
        return;
      }

    // Retrieve access token from localStorage
    let accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');

        const isAccessTokenExpired = isTokenExpired(accessToken);
        const isRefreshTokenExpired = isTokenExpired(refreshToken);

        if (isAccessTokenExpired) {
          // Use the refresh token to get a new access token
          const response = await axios.post(
            'https://oyster-app-4bwlf.ondigitalocean.app/api/accessToken',
            {
              refreshToken: localStorage.getItem('refreshToken'),
            }
          );

          if (response && response.data) {
            // Update the stored access token with the new one
            accessToken = response.data.accessToken;
            localStorage.setItem('accessToken', accessToken);
          } else {
            // Handle the case where refreshing the token failed
            console.error('Error refreshing token:', response);
            return;
          }
        }

    // Send a DELETE request to the country endpoint with authorization header
    await axios.delete(`https://oyster-app-4bwlf.ondigitalocean.app/api/countries/${countryId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Redirect to the countries list or another page after deletion
    navigate('/countries');


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


  if (!country) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1>{country.name}</h1>
      <p>{country.description}</p>
      {accessToken && (<button class="left-aligned-button" onClick={handleEditClick}>Edit</button>)}
      {accessToken && (<button class="right-aligned-button" onClick={handleDeleteClick}>Delete</button>)}
      {errorMessage && ( <p style={{ color: 'red' }}>{errorMessage}</p> )}
    </div>
  );
};



export default CountryDetails;

