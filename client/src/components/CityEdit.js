// src/components/CityEdit.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CityEdit = () => {
  const { countryId, cityId } = useParams();
  const [city, setCity] = useState(null);
  const [editedDescription, setEditedDescription] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://oyster-app-4bwlf.ondigitalocean.app/api/countries/${countryId}/cities/${cityId}`);
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
      // Send a PUT request to update the city description
      await axios.put(`https://oyster-app-4bwlf.ondigitalocean.app/api/countries/${countryId}/cities/${cityId}`, {
        description: editedDescription,
      });
      // Redirect to the city details page after editing
      navigate(`/countries/${countryId}/cities/${cityId}`);
    } catch (error) {
      console.error(`Error editing city with ID ${cityId} in country with ID ${countryId}:`, error);
    }
  };

  if (!city) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1>Edit City: {city.name}</h1>
      <label>
        Description:
        <textarea value={editedDescription} onChange={(e) => setEditedDescription(e.target.value)} />
      </label>
      <button onClick={handleSave}>Save Changes</button>
    </div>
  );
};

export default CityEdit;
