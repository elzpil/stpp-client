// src/components/PlaceCreate.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const PlaceCreate = () => {
  const { countryId, cityId } = useParams();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleCreate = async () => {
    try {
      // Send a POST request to create a new place within the specified city
      const response = await axios.post(`https://oyster-app-4bwlf.ondigitalocean.app/api/countries/${countryId}/cities/${cityId}/places`, {
        name,
        description,
      });

      // Redirect to the details page of the newly created place
      navigate(`/countries/${countryId}/cities/${cityId}/places/${response.data.id}`);
    } catch (error) {
      console.error('Error creating place:', error);
    }
  };

  return (
    <div className="container">
      <h1>Create New Place</h1>
      <label>
        Name:
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <label>
        Description:
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </label>
      <button onClick={handleCreate}>Create Place</button>
    </div>
  );
};

export default PlaceCreate;
