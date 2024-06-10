// src/components/CommentCreate.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import isTokenExpired from './IsTokenExpired';

const CommentCreate = () => {
  const { countryId } = useParams();
  const [content, setContent] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleCreateComment = async () => {
    try {
    let accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const userId = localStorage.getItem('userId');
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
      await axios.post(
        'https://localhost:7036/api/things/comments',
        { content, entityId: countryId, entityType: 'country', userId },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      navigate(`/countries/${countryId}`);
    } catch (error) {
      console.error('Error creating comment:', error.response ? error.response.data : error.message);
      const errorMessage = error.response ? error.response.data.message : error.message;
      setErrorMessage(errorMessage);
    }
  };

  return (
    <div>
      <h2>Create Comment</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your comment here"
      ></textarea>
      <button onClick={handleCreateComment}>Submit</button>
    </div>
  );
};

export default CommentCreate;
