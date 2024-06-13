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
  const UNAUTHORIZED = 403;
  const UNPROCESSABLE_ENTITY = 422;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://localhost:7036/api/countries/${countryId}`);
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
      await axios.put(`https://localhost:7036/api/countries/${countryId}`, {
        description: editedDescription,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      navigate(`/countries`);
  } catch (error) {
    console.error('Error editing country:', error);

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
