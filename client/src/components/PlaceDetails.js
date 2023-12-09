// src/components/PlaceDetails.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const PlaceDetails = () => {
  const { countryId, cityId, placeId } = useParams();
  const [place, setPlace] = useState(null);
  const navigate = useNavigate();

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
      // Send a DELETE request to the place endpoint
      await axios.delete(`https://oyster-app-4bwlf.ondigitalocean.app/api/countries/${countryId}/cities/${cityId}/places/${placeId}`);
      // Redirect to the city details page or another page after deletion
      navigate(`/countries/${countryId}/cities/${cityId}`);
    } catch (error) {
      console.error(`Error deleting place with ID ${placeId} in city with ID ${cityId} in country with ID ${countryId}:`, error);
    }
  };

  if (!place) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1>{place.name}</h1>
      <p>{place.description}</p>
      <button className="left-aligned-button" onClick={handleEditClick}>Edit</button>
      <button className="right-aligned-button" onClick={handleDeleteClick}>Delete</button>
    </div>
  );
};

export default PlaceDetails;
