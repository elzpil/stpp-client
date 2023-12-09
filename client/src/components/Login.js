// components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const handleLogin = async () => {
    try {
      const response = await axios.post('https://oyster-app-4bwlf.ondigitalocean.app/api/login', {
        username,
        password,
      });

      // Handle successful login, e.g., store tokens in local storage
      console.log('Login Successful', response.data);
      navigate('/countries');
    } catch (error) {
      // Handle login error
      console.error('Login Error:', error.response.data);
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
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
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
