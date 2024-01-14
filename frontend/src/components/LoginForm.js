import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook
import './LoginForm.css';
import CTFLeaderboard from './CTFLeaderboard';

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Initialize the navigate function

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:1337/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username, password: password }),
        credentials: 'include', // Include cookies in the request
      });

      if (response.ok) {
        // Assuming the response contains a token or user information
        const responseData = await response.json();

        // Store the received token in local storage
        localStorage.setItem('AccessToken', responseData.accessToken);

        // Call the onLogin function to handle login logic (if needed)
        // Redirect to the dashboard
        onLogin(CTFLeaderboard);
        navigate('/leaderboard');
      } else {
        // Handle authentication errors here
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleRegisterClick = () => {
    // Redirect to the registration page
    navigate('/register');
  };

  const handleFacultyRegisterClick = () => {
    // Redirect to the registration page
    navigate('/register-faculty');
  };

  return (
    <div className="login-container">
      <div className="project-name-foll">Hack2Sec</div>
      <div className="content">
        <div className="hacker-animation"></div>
        <div className="login-form">
        <form onSubmit={handleSubmit}>
  <input
    type="text"
    placeholder="Enter username"
    value={username}
    onChange={(e) => setUsername(e.target.value)}
  />
  <input
    type="password"
    placeholder="Enter password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />
  <button type="submit">Access</button>
  <div className="register-buttons">
    <button type="button" className="register-button" onClick={handleRegisterClick}>
     Student Register
    </button>
    <button type="button" className="register-button" onClick={handleFacultyRegisterClick}>
      Faculty Register
    </button>
  </div>
</form>

        </div>
      </div>
    </div>
  );
};

export default LoginForm;
