
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PlaceDetails = () => {
  const { countryId, cityId, placeId } = useParams();
  const [place, setPlace] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://oyster-app-4bwlf.ondigitalocean.app/api/countries/${countryId}/cities/${cityId}/places/${placeId}`);
        setPlace(response.data);
      } catch (error) {
        console.error(`Error fetching place with ID ${placeId} in city ${cityId}, country ${countryId}:`, error);
      }
    };

    fetchData();
  }, [countryId, cityId, placeId]);

  if (!place) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1>{place.name}</h1>
      <p>{place.description}</p>
    </div>
  );
};

export default PlaceDetails;
