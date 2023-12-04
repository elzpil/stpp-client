// src/components/CityList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

const CityList = () => {
  const [cities, setCities] = useState([]);
  const { countryId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://oyster-app-4bwlf.ondigitalocean.app/api/countries/${countryId}/cities`);
        setCities(response.data);
      } catch (error) {
        console.error(`Error fetching cities for country ${countryId}:`, error);
      }
    };

    fetchData();
  }, [countryId]);

  return (
    <div className="list-container">
      <h1>City List</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {cities.map((city) => (
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
