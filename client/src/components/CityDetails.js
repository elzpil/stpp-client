import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import isTokenExpired from './IsTokenExpired';
import EntityDelete from './EntityDelete';

const CityDetails = () => {
  const { countryId, cityId } = useParams();
  const [city, setCity] = useState(null);
  const [comments, setComments] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken');
  const [map, setMap] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cityResponse = await axios.get(`https://localhost:7036/api/countries/${countryId}/cities/${cityId}`);
        setCity(cityResponse.data);
        const commentResponse = await axios.get(`https://localhost:7036/api/things/comments`);
        const filteredComments = commentResponse.data.filter(
          comment => comment.entityId === parseInt(cityId) && comment.entityType === "city"
        );
        const updatedComments = await Promise.all(filteredComments.map(async (comment) => {
          if (comment.userId) {
            const userName = await fetchUserName(comment.userId);
            return { ...comment, userName };
          } else {
            return { ...comment, userName: "Unknown" };
          }
        }));
        setComments(updatedComments);
        initializeMap(cityResponse.data);
      } catch (error) {
        console.error(`Error fetching city with ID ${cityId} in country ${countryId}:`, error);
      }
    };

    fetchData();
  }, [countryId, cityId]);

  const initializeMap = (cityData) => {
    if (cityData && window.google) {

      const mapOptions = {
        center: {lat:  Number(cityData.latitude), lng: Number(cityData.longitude)},
        zoom: 12,
      };  
      const mapElement = document.getElementById('map');
      const newMap = new window.google.maps.Map(mapElement, mapOptions);
      setMap(newMap);
    }
  };

  const fetchUserName = async (userId) => {
    try {
      const userResponse = await axios.get(`https://localhost:7036/users/${userId}`);
      return userResponse.data;
    } catch (error) {
      console.error(`Error fetching user with ID ${userId}:`, error);
      return null;
    }
  };

  const handleEditClick = () => {
    navigate(`/countries/${countryId}/cities/${cityId}/edit`);
  };

  const handleDeleteClick = async () => {
    try {
      const deletePath =`https://localhost:7036/api/countries/${countryId}/cities/${cityId}`;
      const success = await EntityDelete('city', deletePath);
    if (success) {
      navigate(`/countries/${countryId}/cities`);
    }
      
    } catch (error) {
      console.error('Error deleting:', error);
      const errorMessage = error.response ? error.response.data.message : error.message;
      setErrorMessage(errorMessage);
    }
  };

  if (!city) return <div>Loading...</div>;

  return (
    <div className="container">
      <h1>{city.name}</h1>
      <p>{city.description}</p>
      {accessToken && (<button className="left-aligned-button" onClick={handleEditClick}>Edit</button>)}
      {accessToken && (<button className="right-aligned-button" onClick={handleDeleteClick}>Delete</button>)}
      {errorMessage && (<p style={{ color: 'red' }}>{errorMessage}</p>)}
      <h2>Comments</h2>
      <div>
        {comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment">
              <p><strong>{comment.userName}</strong>: {comment.content}</p>
            </div>
          ))
        )}
      </div>
      <div id="map" style={{ height: '400px', width: '100%' }}></div>
    </div>
  );
};

export default CityDetails;
