import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import isTokenExpired from './IsTokenExpired';
import EntityDelete from './EntityDelete';

const CountryDetails = () => {
  const { countryId } = useParams();
  const [country, setCountry] = useState(null);
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const accessToken = localStorage.getItem('accessToken');
  const [errorMessage, setErrorMessage] = useState('');
  const [map, setMap] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://localhost:7036/api/countries/${countryId}`);
        setCountry(response.data);
        const commentResponse = await axios.get(`https://localhost:7036/api/things/comments`);
        console.log("Comments Data:", commentResponse.data);
        const filteredComments = commentResponse.data.filter(comment => comment.entityId === parseInt(countryId) && comment.entityType === "country");
        const updatedComments = await Promise.all(filteredComments.map(async (comment) => {
          if (comment.userId) {
            const userName = await fetchUserName(comment.userId);
            return { ...comment, userName };
          } else {
            return { ...comment, userName: "Unknown User" };
          }
        }));
        setComments(updatedComments);
        //initializeMap(cityResponse.data);
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
    navigate(`/countries/${countryId}/edit`);
  };

  const handleCreateCommentClick = () => {
    navigate(`/countries/${countryId}/newcomment`);
  };

  const handleDeleteClick = async () => {
    try {
      const deletePath =`https://localhost:7036/api/countries/${countryId}`;
      const success = await EntityDelete('country', deletePath);
      if (success) {
        navigate(`/countries`);
      }
    } catch (error) {
      console.error('Error deleting :', error);

      if (error.response && error.response.status === 422) {
        const validationErrors = error.response.data.errors;
        const errorMessage = Object.values(validationErrors).flat().join(', ');
        setErrorMessage(errorMessage);
      } else if (error.response && error.response.status === 403){
        setErrorMessage("unauthorized");
      } else {
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
      <table> 
        {comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <tr key={comment.id} >
              <td>{comment.userName}</td><td> {comment.content}</td>
            </tr>
          ))
        )}
      </table>
    </div>
  );
};

export default CountryDetails;

