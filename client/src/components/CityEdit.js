import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import isTokenExpired from './IsTokenExpired';

const CityEdit = () => {
  const { countryId, cityId } = useParams();
  const [city, setCity] = useState(null);
  const [editedDescription, setEditedDescription] = useState('');
  const [editedLong, setEditedLong] = useState('');
  const [editedLat, setEditedLat] = useState('');
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const UNAUTHORIZED = 403;
  const UNPROCESSABLE_ENTITY = 422;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://localhost:7036/api/countries/${countryId}/cities/${cityId}`);
        const { description, latitude, longitude } = response.data;
        setCity(response.data);
        setEditedDescription(description);
        setEditedLat(latitude);
        setEditedLong(longitude);
      } catch (error) {
        console.error(`Error fetching city with ID ${cityId} in country with ID ${countryId}:`, error);
      }
    };

    fetchData();
  }, [countryId, cityId]);

  const handleSave = async () => {
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

      await axios.put(`https://localhost:7036/api/countries/${countryId}/cities/${cityId}`, {
        description: editedDescription,
        latitude: editedLat,
        longitude: editedLong,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      
      navigate(`/countries/${countryId}/cities`);
  } catch (error) {
    console.error('Error editing :', error);

      if (error.response && error.response.status === UNPROCESSABLE_ENTITY) {
        const validationErrors = error.response.data.errors;
        const errorMessage = Object.values(validationErrors).flat().join(', ');
        setErrorMessage(errorMessage);
      } else if (error.response && error.response.status === UNAUTHORIZED){
        setErrorMessage("unauthorized");
      } else {
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
      <h1>Edit City: {city.name}</h1>
      {errorMessage && ( <p style={{ color: 'red' }}>{errorMessage}</p> )}
      <label>
        Description:
        <textarea value={editedDescription} onChange={(e) => setEditedDescription(e.target.value)} />
      </label>
      <label>
        Latitude:
        <input type="text" value={editedLat} onChange={(e) => setEditedLat(e.target.value)} ></input>
      </label>
      <label>
        Longitude:
        <input type="text" value={editedLong} onChange={(e) => setEditedLong(e.target.value)} ></input>
      </label>
      <button onClick={handleSave}>Save Changes</button>
    </div>
  );
};

export default CityEdit;
