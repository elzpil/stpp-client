// src/components/CityCreate.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const CityCreate = () => {
  const { countryId } = useParams();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleCreate = async () => {
    try {
      // Send a POST request to create a new city within the specified country
      const response = await axios.post(`https://oyster-app-4bwlf.ondigitalocean.app/api/countries/${countryId}/cities`, {
        name,
        description,
      });

      // Redirect to the details page of the newly created city
      navigate(`/countries/${countryId}/cities/${response.data.id}`);
    } catch (error) {
      console.error('Error creating city:', error);
    }
  };

  return (
    <div className="container">
      <h1>Create New City</h1>
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
