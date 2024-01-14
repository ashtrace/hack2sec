import React, { useState } from 'react';
import './StudentRegistration.css';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook

const StudentRegisterForm = ({ onRegister }) => {
  const [firstname, setFirstName] = useState('');
  const [lastname, setlastname] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roll_no, setroll_no] = useState('');
  const [branch, setBranch] = useState('');
  const navigate = useNavigate(); // Initialize the navigate function
  const [year, setYear] = useState('');

  const [passwordErrors, setPasswordErrors] = useState([]);
  
  const branches = ['B.Tech DFCS', 'B.Tech CC', 'B.Tech AIML', 'B.Tech GT', 'BCA', 'MCA'];
const years = ['1', '2', '3', '4'];

const handleloginClick = () => {
  // Redirect to the registration page
  navigate('/login');
};

  const validatePassword = () => {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/;

    const errors = [];

    if (password.length < 10) {
      errors.push('Password must be at least 10 characters.');
    }

    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Password must contain at least one lowercase letter.');
    }

    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Password must contain at least one uppercase letter.');
    }

    if (!/(?=.*\d)/.test(password)) {
      errors.push('Password must contain at least one number.');
    }

    if (!/(?=.*[@$!%*?&])/.test(password)) {
      errors.push('Password must contain at least one special character.');
    }

    setPasswordErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firstname || !lastname || !username || !email || !password || !roll_no || !branch || !year) {
      alert('All fields are mandatory. Please fill in all the fields.');
      return;
    }

    if (!validatePassword()) {
      alert('Password is not strong enough.');
      return;
    }

    try {
      const response = await fetch('http://localhost:1337/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstname,
          lastname,
          username,
          email,
          password,
          roll_no,
          branch,
          year,
        }),
      });

      if (response.ok) {
        alert('Registration Successful. Happy hacking.');
        // You can add logic to redirect to the login page here if needed
        onRegister('LoginForm');
      } else if (response.status === 409) {
        alert('User Already Exists');
      } else {
        alert('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="register-container">
      <div className="content">
        <div className="project-name">Student Registration</div>
        <div className="registration-form">
          <form onSubmit={handleSubmit}>
            {/* First Row */}
            <div className="form-row">
              <input
                type="text"
                placeholder="First Name"
                value={firstname}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                value={lastname}
                onChange={(e) => setlastname(e.target.value)}
                required
              />
            </div>

            {/* Second Row */}
            <div className="form-row">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email ID"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Third Row */}
            <div className="form-row">
              <input
                type="password"
                placeholder="Choose a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Roll Number"
                value={roll_no}
                onChange={(e) => setroll_no(e.target.value)}
                required
              />
            </div>

            {/* Fourth Row */}
            <div className="form-row">
        <select
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          required
        >
          <option value="" disabled>Select Branch</option>
          {branches.map((branchOption, index) => (
            <option key={index} value={branchOption}>{branchOption}</option>
          ))}
        </select>
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          required
        >
          <option value="" disabled>Select Year</option>
          {years.map((yearOption, index) => (
            <option key={index} value={yearOption}>{yearOption}</option>
          ))}
        </select>
      </div>

            {/* Password Errors */}
            {passwordErrors.length > 0 && (
              <div className="password-errors">
                <ul>
                  {passwordErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Submit Button */}
            <button type="submit">Register</button> <button type="button" onClick={handleloginClick}>Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentRegisterForm;
