import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './components.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); // State to store registration error
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

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
        navigate('/login');
      } else {
        console.error('Invalid response:', response);
        setError('Invalid response');
      }
} catch (error) {
  console.error('Registration Error:', error.response ? error.response.data : error.message);
//setErrorMessage('Example error message!');
  const errorMessage = error.response ? error.response.data.message : error.message;
  // Use a function form of setState to ensure state is updated correctly
  setErrorMessage(error.response ? error.response.data : error.message);

}


  };

  return (
    <div className="container">
      <h2>Register</h2>
      {errorMessage && ( <p style={{ color: 'red' }}>{errorMessage}</p> )}
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
