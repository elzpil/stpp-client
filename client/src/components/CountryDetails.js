// src/components/CountryDetails.js
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import isTokenExpired from './IsTokenExpired';

const CountryDetails = () => {
const { countryId } = useParams();
const [country, setCountry] = useState(null);
const navigate = useNavigate();
const [comments, setComments] = useState([]);
const accessToken = localStorage.getItem('accessToken');
const [errorMessage, setErrorMessage] = useState('');

useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get(`https://localhost:7036/api/countries/${countryId}`);
      setCountry(response.data);
      const commentResponse = await axios.get(`https://localhost:7036/api/things/comments`);
      console.log("Comments Data:", commentResponse.data);
      const filteredComments = commentResponse.data.filter(comment => comment.entityId === parseInt(countryId) && comment.entityType === "country");
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
      console.error(`Error fetching country with ID ${countryId}:`, error);
    }
  };

  fetchData();
}, [countryId]);
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
  // Navigate to the edit page
  navigate(`/countries/${countryId}/edit`);
};

const handleCreateCommentClick = () => {
  navigate(`/countries/${countryId}/newcomment`);
};

const handleDeleteClick = async () => {
  try {

  const confirmed = window.confirm('Are you sure you want to delete this country?');

      if (!confirmed) {
        // If the user cancels the operation, do nothing
        return;
      }

    // Retrieve access token from localStorage
    let accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    const isAccessTokenExpired = isTokenExpired(accessToken);
    const isRefreshTokenExpired = isTokenExpired(refreshToken);

    if (isAccessTokenExpired) {
      // Use the refresh token to get a new access token
      const response = await axios.post(
        'https://localhost:7036/api/accessToken',
        {
          refreshToken: localStorage.getItem('refreshToken'),
        }
      );

      if (response && response.data) {
        // Update the stored access token with the new one
        accessToken = response.data.accessToken;
        localStorage.setItem('accessToken', accessToken);
      } else {
        // Handle the case where refreshing the token failed
        console.error('Error refreshing token:', response);
        return;
      }
    }

    // Send a DELETE request to the country endpoint with authorization header
    await axios.delete(`https://localhost:7036/api/countries/${countryId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Redirect to the countries list or another page after deletion
    navigate('/countries');


  } catch (error) {
    console.error('Error deleting :', error);

    if (error.response && error.response.status === 422) {
      // Handle validation errors
      const validationErrors = error.response.data.errors;
      const errorMessage = Object.values(validationErrors).flat().join(', ');
      setErrorMessage(errorMessage);
    } else if (error.response && error.response.status === 403){
      setErrorMessage("unauthorized");
    } else {

      // Handle other types of errors
      const errorMessage = error.response ? error.response.data.message : error.message;
      setErrorMessage(errorMessage);
    }
  }
};


  if (!country) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1>{country.name}</h1>
      <p>{country.description}</p>
      {accessToken && (<button className="left-aligned-button" onClick={handleEditClick}>Edit</button>)}
      {accessToken && (<button className="right-aligned-button" onClick={handleDeleteClick}>Delete</button>)}
      {errorMessage && ( <p style={{ color: 'red' }}>{errorMessage}</p> )}
      <br/>
      {accessToken && (
        <button  onClick={handleCreateCommentClick}>
          Create Comment
        </button>
    )}
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



export default CountryDetails;

