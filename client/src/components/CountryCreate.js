// src/components/CountryCreate.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import isTokenExpired from './IsTokenExpired';

const CountryCreate = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

const handleCreate = async () => {
  try {
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

    // Continue with the original request using the updated access token
    const response = await axios.post(
      'https://oyster-app-4bwlf.ondigitalocean.app/api/countries',
      {
        name,
        description,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Redirect to the details page of the newly created country
    navigate(`/countries/${response.data.id}`);

  } catch (error) {
    console.error('Error creating country:', error);

    if (error.response && error.response.status === 422) {
      // Handle validation errors
      const validationErrors = error.response.data.errors;
      const errorMessage = Object.values(validationErrors).flat().join(', ');
      setErrorMessage(errorMessage);
    } else {
      // Handle other types of errors
      const errorMessage = error.response ? error.response.data.message : error.message;
      setErrorMessage(errorMessage);
    }
  }
};



  return (
    <div className="container">
      <h1>Create New Country</h1>
      {errorMessage && ( <p style={{ color: 'red' }}>{errorMessage}</p> )}
      <label>
        Name:
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <label>
        Description:
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </label>
      <button onClick={handleCreate}>Create Country</button>
    </div>
  );
};

export default CountryCreate;
