// src/components/CityEdit.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import isTokenExpired from './IsTokenExpired';

const CityEdit = () => {
  const { countryId, cityId } = useParams();
  const [city, setCity] = useState(null);
  const [editedDescription, setEditedDescription] = useState('');
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://localhost:7036/api/countries/${countryId}/cities/${cityId}`);
        const { description } = response.data;
        setCity(response.data);
        setEditedDescription(description);
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
           // Use the refresh token to get a new access token
           const response = await axios.post(
             'https://localhost:7036/api/accessToken',
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
      // Send a PUT request to update the city description
      await axios.put(`https://localhost:7036/api/countries/${countryId}/cities/${cityId}`, {
        description: editedDescription,
      },
                    {
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                      },
                    });
      // Redirect to the city details page after editing
      navigate(`/countries/${countryId}/cities`);
  } catch (error) {
    console.error('Error editing :', error);

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
      <h1>Edit City: {city.name}</h1>
      {errorMessage && ( <p style={{ color: 'red' }}>{errorMessage}</p> )}
      <label>
        Description:
        <textarea value={editedDescription} onChange={(e) => setEditedDescription(e.target.value)} />
      </label>
      <button onClick={handleSave}>Save Changes</button>
    </div>
  );
};

export default CityEdit;
