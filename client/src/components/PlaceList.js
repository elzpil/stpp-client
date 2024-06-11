// src/components/PlaceList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

const PlaceList = () => {
const [places, setPlaces] = useState([]);
const { countryId, cityId } = useParams();
const accessToken = localStorage.getItem('accessToken');
const [searchQuery, setSearchQuery] = useState('');

useEffect(() => {
const fetchData = async () => {
  try {
    const response = await axios.get(`https://localhost:7036/api/countries/${countryId}/cities/${cityId}/places`);
    setPlaces(response.data);
  } catch (error) {
    console.error(`Error fetching places for city ${cityId} in country ${countryId}:`, error);
  }
};

fetchData();
}, [countryId, cityId]);

const handleSearchChange = (event) => {
  setSearchQuery(event.target.value);
};

const filteredPlaces = places.filter((place) =>
  place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  place.description.toLowerCase().includes(searchQuery.toLowerCase())
);

  return (
    <div className="container">
      <h1>Place List</h1>
    <input
        type="text"
        placeholder="Search places..."
        value={searchQuery}
        onChange={handleSearchChange}
      />
      <br />
      <br />
      {accessToken && (
          <Link to={`/countries/${countryId}/cities/${cityId}/places/new`}>
            <button>Create New Place</button>
          </Link>
        )}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {filteredPlaces.map((place) => (
            <tr key={place.id}>
              <td>
                {/* Link to place details */}
                <Link to={`/countries/${countryId}/cities/${cityId}/places/${place.id}`}>{place.name}</Link>
              </td>
              <td>{place.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlaceList;
