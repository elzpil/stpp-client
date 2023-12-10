import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken');

  const handleLogin = async (username, password) => {
    try {
      const response = await axios.post(
        'https://oyster-app-4bwlf.ondigitalocean.app/api/login',
        {
          username,
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response && response.data) {
        const { accessToken, refreshToken } = response.data;

        // Store tokens in localStorage
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('username', username);

        // Redirect after successful login
        navigate('/countries');
      } else {
        console.error('Invalid response:', response);
      }
    } catch (error) {
      console.error('Login Error:', error.response ? error.response.data : error.message);
      const errorMessage = error.response ? error.response.data.message : error.message;
      setErrorMessage(errorMessage);
    }
  };

  const handleLogout = () => {
    // Clear tokens from localStorage or wherever they are stored
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('username');
    // Redirect to the login page or another route after logout
    navigate('/countries');
  };

  return (
    <div className="container">
      <h2>Login</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <label htmlFor="username">Username</label>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <label htmlFor="password">Password</label>
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={() => handleLogin(username, password)}>Login</button>

      {accessToken && (<button onClick={handleLogout}>Logout</button>)}
    </div>
  );
};

export default Login;
