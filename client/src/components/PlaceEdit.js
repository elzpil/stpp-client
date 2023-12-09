// src/components/PlaceEdit.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';

const PlaceEdit = () => {
  const { countryId, cityId, placeId } = useParams();
  const [place, setPlace] = useState(null);
  const [editedDescription, setEditedDescription] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://oyster-app-4bwlf.ondigitalocean.app/api/countries/${countryId}/cities/${cityId}/places/${placeId}`);
        const { description } = response.data;
        setPlace(response.data);
        setEditedDescription(description);
      } catch (error) {
        console.error(`Error fetching place with ID ${placeId} in city with ID ${cityId} in country with ID ${countryId}:`, error);
      }
    };

    fetchData();
  }, [countryId, cityId, placeId]);

  const handleSave = async () => {
    try {
      // Send a PUT request to update the place description
      await axios.put(`https://oyster-app-4bwlf.ondigitalocean.app/api/countries/${countryId}/cities/${cityId}/places/${placeId}`, {
        description: editedDescription,
      });
      // Redirect to the place details page after editing
      navigate(`/countries/${countryId}/cities/${cityId}/places/${placeId}`);
    } catch (error) {
      console.error(`Error editing place with ID ${placeId} in city with ID ${cityId} in country with ID ${countryId}:`, error);
    }
  };

  if (!place) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1>Edit Place: {place.name}</h1>
      <label>
        Description:
        <textarea value={editedDescription} onChange={(e) => setEditedDescription(e.target.value)} />
      </label>
      <button onClick={handleSave}>Save Changes</button>
    </div>
  );
};

export default PlaceEdit;
