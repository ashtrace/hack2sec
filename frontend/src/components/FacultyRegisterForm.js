import React, { useState, useEffect } from 'react';
import './FacultyRegisterForm.css';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook

const FacultyRegisterForm = ({ onRegister }) => {
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [empId, setempId] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate(); // Initialize the navigate function
    const [subjectList, setSubjectList] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  

   useEffect(() => {
    // Fetch subject list from the API
    const fetchSubjectList = async () => {
      try {
        const accessToken = localStorage.getItem('AccessToken');
        const response = await fetch('http://localhost:1337/api/subjects', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data); // Log the subject list data
          if (data) {
            setSubjectList(data);
          } else {
            console.error('Subject list is undefined.');
          }
        } else {
          console.error('Failed to fetch subject list.');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchSubjectList();
  }, []);

  const handleloginClick = () => {
    // Redirect to the registration page
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!firstname || !lastname || !empId || !email || !selectedSubject) {
      alert('All fields are mandatory. Please fill in all the fields.');
      return;
    }
  
    try {
      const accessToken = localStorage.getItem('AccessToken'); // Retrieve access token from localStorage
  
      const response = await fetch('http://localhost:1337/api/faculty/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          firstname,
          lastname,
          empId,
          email,
          subject: selectedSubject,
        }),
      });
  
      if (response.ok) {
        alert('Registration Requested, You will Receive an Email with Password.');
        // Reset all input fields to empty strings
        setFirstName('');
        setLastName('');
        setempId('');
        setEmail('');
        setSelectedSubject('');
  
        // You can add logic to redirect to the login page here if needed
        onRegister('LoginForm');
      } else if (response.status === 409) {
        const responseData = await response.json();
        alert(responseData.message);
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
        <div className="project-name">Faculty Registration</div>
        <div className="registration-form">
          <form onSubmit={handleSubmit}>
            {/* First Row */}
            
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
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            

            {/* Second Row */}
            
              <input
                type="text"
                placeholder="EMP ID"
                value={empId}
                onChange={(e) => setempId(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email ID"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            

            {/* Third Row */}
            
          
              <select
                name="subject_id"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                required
              >
                <option value="" disabled>Select Subject</option>
                {subjectList.map((subject) => (
                  <option key={subject._id} value={subject._id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            

           
            {/* Submit Button */}
           
            <button type="submit">Register</button> <button type="button" onClick={handleloginClick}>Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FacultyRegisterForm;
