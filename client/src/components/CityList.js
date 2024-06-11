// src/components/CityList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

const CityList = () => {
  const [cities, setCities] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { countryId } = useParams();
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://localhost:7036/api/countries/${countryId}/cities`);
        setCities(response.data);
      } catch (error) {
        console.error(`Error fetching cities for country ${countryId}:`, error);
      }
    };

    fetchData();
  }, [countryId]);

const handleSearchChange = (event) => {
  setSearchQuery(event.target.value);
};

const filteredCities = cities.filter((city) =>
  city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  city.description.toLowerCase().includes(searchQuery.toLowerCase())
);

  return (
    <div className="container">
      <h1>City List</h1>
    <input
        type="text"
        placeholder="Search cities..."
        value={searchQuery}
        onChange={handleSearchChange}
      />
      <br />
      <br />

      {accessToken && (
              <Link to={`/countries/${countryId}/cities/new`}>
                <button>Create New City</button>
              </Link>
            )}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {filteredCities.map((city) => (
            <tr key={city.id}>
              <td><Link to={`/countries/${countryId}/cities/${city.id}`}>{[city.name]}</Link></td>
              <td>{city.description}</td>
              <td>
                {/* Link to the city details */}
                <Link to={`/countries/${countryId}/cities/${city.id}/places`}>Places</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CityList;
