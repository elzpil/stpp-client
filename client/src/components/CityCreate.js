// src/components/CityCreate.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import isTokenExpired from './IsTokenExpired';

const CityCreate = () => {
  const { countryId } = useParams();
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
        const response = await axios.post(
         'https://localhost:7036/api/accessToken',
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

      const response = await axios.post(`https://localhost:7036/api/countries/${countryId}/cities`, {
        name,
        description,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      navigate(`/countries/${countryId}/cities`);
    } catch (error) {
      console.error('Error creating country:', error);

      if (error.response && error.response.status === 422) {
        const validationErrors = error.response.data.errors;
        const errorMessage = Object.values(validationErrors).flat().join(', ');
        setErrorMessage(errorMessage);
      } else {
        const errorMessage = error.response ? error.response.data.message : error.message;
        setErrorMessage(errorMessage);
      }
    }
  };

  return (
    <div className="container">
      <h1>Create New City</h1>
      {errorMessage && ( <p style={{ color: 'red' }}>{errorMessage}</p> )}
      <label>
        Name:
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <label>
        Description:
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </label>
      <button onClick={handleCreate}>Create City</button>
    </div>
  );
};

export default CityCreate;
