// src/components/CountryCreate.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CountryCreate = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleCreate = async () => {
    try {
      // Send a POST request to create a new country
      const response = await axios.post('https://oyster-app-4bwlf.ondigitalocean.app/api/countries', {
        name,
        description,
      });

      // Redirect to the details page of the newly created country
      navigate(`/countries/${response.data.id}`);
    } catch (error) {
      console.error('Error creating country:', error);
    }
  };

  return (
    <div className="container">
      <h1>Create New Country</h1>
      <label>
        Name:
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <label>
        Description:
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </label>
      <button onClick={handleCreate}>Create Country</button>
    </div>
  );
};

export default CountryCreate;
