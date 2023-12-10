// src/components/CountryEdit.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import isTokenExpired from './IsTokenExpired';

const CountryEdit = () => {
  const { countryId } = useParams();
  const [country, setCountry] = useState(null);
  const [editedDescription, setEditedDescription] = useState('');
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://oyster-app-4bwlf.ondigitalocean.app/api/countries/${countryId}`);
        const { description } = response.data;
        setCountry(response.data);
        setEditedDescription(description);
      } catch (error) {
        console.error(`Error fetching country with ID ${countryId}:`, error);
      }
    };

    fetchData();
  }, [countryId]);

  const handleSave = async () => {
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
      // Send a PUT request to update the country description
      await axios.put(`https://oyster-app-4bwlf.ondigitalocean.app/api/countries/${countryId}`, {
        description: editedDescription,
      },
             {
               headers: {
                 'Content-Type': 'application/json',
                 Authorization: `Bearer ${accessToken}`,
               },
             });
      // Redirect to the country details page after editing
      navigate(`/countries`);
  } catch (error) {
    console.error('Error editing country:', error);

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
      <h1>Edit Country: {country.name}</h1>
      {errorMessage && ( <p style={{ color: 'red' }}>{errorMessage}</p> )}
      <label>
        Description:
        <textarea value={editedDescription} onChange={(e) => setEditedDescription(e.target.value)} />
      </label>
      <button onClick={handleSave}>Save Changes</button>
    </div>
  );
};

export default CountryEdit;
