import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (username, password) => {
    try {
      const response = await axios.post(
        'https://localhost:7036/api/login',
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

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        const userInfoResponse = await axios.get(
          'https://localhost:7036/users/me',
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`
            }
          }
        );

        if (userInfoResponse && userInfoResponse.data) {
          const { userName, id } = userInfoResponse.data;
          console.log(userName + id);
          localStorage.setItem('username', username);
          localStorage.setItem('userId', id); 
        }
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
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
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
      <br />
      <button onClick={() => handleLogin(username, password)}>Login</button>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Login;
