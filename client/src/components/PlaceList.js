// src/components/PlaceList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

const PlaceList = () => {
  const [places, setPlaces] = useState([]);
  const { countryId, cityId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://oyster-app-4bwlf.ondigitalocean.app/api/countries/${countryId}/cities/${cityId}/places`);
        setPlaces(response.data);
      } catch (error) {
        console.error(`Error fetching places for city ${cityId} in country ${countryId}:`, error);
      }
    };

    fetchData();
  }, [countryId, cityId]);

  return (
    <div className="list-container">
      <h1>Place List for City {cityId}</h1>
      <Link to={`/countries/${countryId}/cities/${cityId}/places/new`}>
        <button>Create New Place</button>
      </Link>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {places.map((place) => (
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
