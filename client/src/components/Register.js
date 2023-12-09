import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './components.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Access the navigate function
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await axios.post(
        'https://oyster-app-4bwlf.ondigitalocean.app/api/register',
        {
          username,
          email,
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response && response.data) {
        console.log('Registration Successful', response.data);

        // Redirect to the login page after successful registration
        navigate('/login');
      } else {
        console.error('Invalid response:', response);
      }
    } catch (error) {
      // Handle registration error
      console.error('Registration Error:', error.response ? error.response.data : error.message);
    }
  };




return (
    <div className="container">
      <h2>Register</h2>
      <label htmlFor="username">Username</label>
      <input
        type="text"
        id="username"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <label htmlFor="email">Email</label>
      <input
        type="text"
        id="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <label htmlFor="password">Password</label>
      <input
        type="password"
        id="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleRegister}>Register</button>
    </div>
  );
};


export default Register;
