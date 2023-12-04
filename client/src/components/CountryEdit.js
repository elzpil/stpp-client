// src/components/CountryEdit.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CountryEdit = () => {
  const { countryId } = useParams();
  const [country, setCountry] = useState(null);
  const [editedDescription, setEditedDescription] = useState('');
  const navigate = useNavigate();

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
      // Send a PUT request to update the country description
      await axios.put(`https://oyster-app-4bwlf.ondigitalocean.app/api/countries/${countryId}`, {
        description: editedDescription,
      });
      // Redirect to the country details page after editing
      navigate(`/countries/${countryId}`);
    } catch (error) {
      console.error(`Error editing country with ID ${countryId}:`, error);
    }
  };

  if (!country) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1>Edit Country: {country.name}</h1>
      <label>
        Description:
        <textarea value={editedDescription} onChange={(e) => setEditedDescription(e.target.value)} />
      </label>
      <button onClick={handleSave}>Save Changes</button>
    </div>
  );
};

export default CountryEdit;
