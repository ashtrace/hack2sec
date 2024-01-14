// FacultyVerificationDashboard.js
import React, { useState, useEffect } from 'react';
import './FacultyVerificationDashboard.css';

const FacultyVerificationDashboard = ({ onClose }) => {
  const [facultyList, setFacultyList] = useState([]);

  useEffect(() => {
    // Fetch faculty details on component mount
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const accessToken = localStorage.getItem('AccessToken');
      const response = await fetch('http://localhost:1337/api/faculty/verify', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFacultyList(data);
      } else {
        console.error('Failed to fetch faculty details.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleVerify = async (facultyId) => {
    try {
      const accessToken = localStorage.getItem('AccessToken');
      const response = await fetch(`http://localhost:1337/api/faculty/verify/${facultyId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        alert('Faculty verified successfully.');
        console.log('Faculty verified successfully.');
        
        fetchData();
      } else {
        console.error('Failed to verify faculty.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleReject = async (facultyId) => {
    try {
      const accessToken = localStorage.getItem('AccessToken');
      const response = await fetch(`http://localhost:1337/api/faculty/verify`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({faculty_id: facultyId}),
      });

      if (response.ok) {
        alert('Faculty Rejected successfully.');
        fetchData();
      } else {
        console.error('Failed to Reject faculty.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="faculty-verification-dashboard">
      <div className="popup-header">
        <h1>Faculty Verification Dashboard</h1>
       
      </div>
      <div className="faculty-list">
        {facultyList.map((faculty) => (
          <div className="faculty-card" key={faculty._id}>
            <div className="faculty-details">
              <p>Name: {faculty.firstname}</p>
              <p>Email: {faculty.email}</p>
              <p>Employee ID: {faculty.empId}</p>
              {/* Add more faculty details as needed */}
            </div>
            <div className="action-buttons">
              <button onClick={() => handleVerify(faculty._id)}>Verify</button>
              <button onClick={() => handleReject(faculty._id)}>Reject</button>
              </div>
            
          </div>
          
        ))}
        
      </div>
      <button className="popup-close" onClick={onClose}>
          Close
        </button>
    </div>
  );
};

export default FacultyVerificationDashboard;
