// src/components/CityList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const CityList = () => {
  const [cities, setCities] = useState([]);
  const { countryId } = useParams(); // Use the useParams hook to get the countryId

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
      <h1>City List for Country {countryId}</h1>
      <table>
        <thead>
          <tr>
            <th>Name       </th>
            <th>Description</th>
            <th>           </th>
          </tr>
        </thead>
        <tbody>
          {cities.map((city) => (
            <tr key={city.id}>
              <td>{city.name}</td>
              <td>{city.description}</td>
              <td></td> {/* Empty column */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CityList;
