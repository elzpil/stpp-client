import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import isTokenExpired from './IsTokenExpired';
import EntityDelete from './EntityDelete';

const PlaceDetails = () => {
  const { countryId, cityId, placeId } = useParams();
  const [place, setPlace] = useState(null);
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken');
  const [errorMessage, setErrorMessage] = useState('');
  const [comments, setComments] = useState([]);
  const UNAUTHORIZED = 403;
  const UNPROCESSABLE_ENTITY = 422;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://localhost:7036/api/countries/${countryId}/cities/${cityId}/places/${placeId}`);
        setPlace(response.data);
        const commentResponse = await axios.get(`https://localhost:7036/api/things/comments`);
        console.log("Comments Data:", commentResponse.data);
        const filteredComments = commentResponse.data.filter(comment => comment.entityId === parseInt(placeId) && comment.entityType === "place");
        // Fetch user names for comments and update state
        const updatedComments = await Promise.all(filteredComments.map(async (comment) => {
          if (comment.userId) {
            const userName = await fetchUserName(comment.userId);
            return { ...comment, userName };
          } else {
            return { ...comment, userName: "Unknown User" };
          }
        }));
        setComments(updatedComments);
      } catch (error) {
        console.error(`Error fetching place with ID ${placeId} in city with ID ${cityId} in country with ID ${countryId}:`, error);
      }
    };

    fetchData();
  }, [countryId, cityId, placeId]);
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
    navigate(`/countries/${countryId}/cities/${cityId}/places/${placeId}/edit`);
  };

  const handleDeleteClick = async () => {
  try {
    const deletePath =`https://localhost:7036/api/countries/${countryId}/cities/${cityId}/places/${placeId}`;
    const success = await EntityDelete('place', deletePath);
    if (success) {
      navigate(`/countries/${countryId}/cities/${cityId}/places`);
    }
  } catch (error) {
    console.error('Error deleting :', error);
    if (error.response && error.response.status === UNPROCESSABLE_ENTITY) {
      const validationErrors = error.response.data.errors;
      const errorMessage = Object.values(validationErrors).flat().join(', ');
      setErrorMessage(errorMessage);
    } else if (error.response && error.response.status === UNAUTHORIZED){
      setErrorMessage("unauthorized");
    } else {
      const errorMessage = error.response ? error.response.data.message : error.message;
      setErrorMessage(errorMessage);
    }
  }
};

  if (!place) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1>{place.name}</h1>
      <p>{place.description}</p>
      {accessToken && (<button class="left-aligned-button" onClick={handleEditClick}>Edit</button>)}
      {accessToken && (<button class="right-aligned-button" onClick={handleDeleteClick}>Delete</button>)}
      {errorMessage && ( <p style={{ color: 'red' }}>{errorMessage}</p> )}
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
    </div>
  );
};

export default PlaceDetails;
