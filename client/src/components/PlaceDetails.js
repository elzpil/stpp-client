// src/components/PlaceDetails.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import isTokenExpired from './IsTokenExpired';

const PlaceDetails = () => {
  const { countryId, cityId, placeId } = useParams();
  const [place, setPlace] = useState(null);
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://oyster-app-4bwlf.ondigitalocean.app/api/countries/${countryId}/cities/${cityId}/places/${placeId}`);
        setPlace(response.data);
      } catch (error) {
        console.error(`Error fetching place with ID ${placeId} in city with ID ${cityId} in country with ID ${countryId}:`, error);
      }
    };

    fetchData();
  }, [countryId, cityId, placeId]);

  const handleEditClick = () => {
    // Navigate to the edit page for the current place
    navigate(`/countries/${countryId}/cities/${cityId}/places/${placeId}/edit`);
  };

  const handleDeleteClick = async () => {
  try {

  const confirmed = window.confirm('Are you sure you want to delete this place?');

      if (!confirmed) {
        // If the user cancels the operation, do nothing
        return;
      }

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

      // Send a DELETE request to the place endpoint
      await axios.delete(`https://oyster-app-4bwlf.ondigitalocean.app/api/countries/${countryId}/cities/${cityId}/places/${placeId}`, {
                                                                                                                                          headers: {
                                                                                                                                            'Content-Type': 'application/json',
                                                                                                                                            Authorization: `Bearer ${accessToken}`,
                                                                                                                                          },
                                                                                                                                        });
      // Redirect to the city details page or another page after deletion
      navigate(`/countries/${countryId}/cities/${cityId}/places`);
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

  if (!place) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1>{place.name}</h1>
      <p>{place.description}</p>
      {accessToken && (<button class="left-aligned-button" onClick={handleEditClick}>Edit</button>)}
      {accessToken && (<button class="right-aligned-button" onClick={handleDeleteClick}>Delete</button>)}
      {errorMessage && ( <p style={{ color: 'red' }}>{errorMessage}</p> )}
    </div>
  );
};

export default PlaceDetails;
