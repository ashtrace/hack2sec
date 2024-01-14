import React, { useState, useEffect, useRef } from 'react';
import './AdminPanel.css';
import Chart from 'chart.js/auto';
import NavBar from './Nav_bar';
import FacultyVerificationDashboard from './FacultyVerificationDashboard';
import CTFLeaderboard from './CTFLeaderboard';

const AdminPanel = () => {
  const [activePage, setActivePage] = useState('');
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(true);
  const [showFacultyVerification, setShowFacultyVerification] = useState(false);
  const chartRef = useRef(null);
  document.body.style.overflow = 'hidden';

  const toggleRegistration = () => {
    setRegistrationOpen(!registrationOpen);
  };

  const toggleLeaderboard = () => {
    setShowLeaderboard(!showLeaderboard);
  };

  const toggleFacultyVerification = () => {
    setShowFacultyVerification(!showFacultyVerification);
  };

  const closeFacultyVerification = () => {
    setShowFacultyVerification(false);
  };

  const [name, setSubjectName] = useState('');
  const [subject_code, setSubjectCode] = useState('');

  const handleSubjectSubmit = async () => {
    try {
      const token = localStorage.getItem('AccessToken');
      if (!token) {
        alert('Authentication token not found in localStorage. Please log in.');
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      const subjectData = {
        name: name,
        subject_code: subject_code,
      };

      const response = await fetch('http://localhost:1337/api/subjects', {
        method: 'POST',
        headers,
        body: JSON.stringify(subjectData),
      });

      if (response.status === 201) {
        alert('Subject created successfully!');
        setSubjectName('');
        setSubjectCode('');
      } else {
        throw new Error('Failed to create subject.');
      }
    } catch (error) {
      console.error('Error creating subject:', error);
      alert('An error occurred while creating the subject.');
    }
  };

  const handleCloseFacultyVerification = () => {
    setShowFacultyVerification(false);
  };

  const chartInstanceRef = useRef(null);

  const fetchDataAndCreateChart = async () => {
    try {
      const token = localStorage.getItem('AccessToken');
      if (!token) {
        alert('Authentication token not found in localStorage. Please log in.');
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await fetch('http://localhost:1337/api/stats/leaderboard', {
        headers,
      });

      if (response.ok) {
        const data = await response.json();
        const labels = data.labels.map(date => {
          const [month, day, year] = date.split('/');
          return `${day}/${month}/${year}`;
        });

        const leaderboardData = data.leaderboardData.map(user => ({
          label: user.username,
          data: user.scores,
          borderColor: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 1)`,
          borderWidth: 2,
          fill: false,
        }));

        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
        }

        const newChartInstance = new Chart(chartRef.current, {
          type: 'line',
          data: {
            labels,
            datasets: leaderboardData,
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });

        chartInstanceRef.current = newChartInstance;
      } else {
        throw new Error('Failed to fetch leaderboard data.');
      }
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
      alert('An error occurred while fetching leaderboard data.');
    }
  };

  const [userCount, setUserCount] = useState(null);
  const [facultyCount, setFacultyCount] = useState(null);
  const [challengeCount, setChallengeCount] = useState(null);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('AccessToken');
      if (!token) {
        alert('Authentication token not found in localStorage. Please log in.');
        return;
      }
  
      const headers = {
        Authorization: `Bearer ${token}`,
      };
  
      const userResponse = await fetch('http://localhost:1337/api/stats/count/users', {
        headers,
      });
  
      const facultyResponse = await fetch('http://localhost:1337/api/stats/count/faculty', {
        headers,
      });
  
      const challengeResponse = await fetch('http://localhost:1337/api/stats/count/challenges', {
        headers,
      });
  
      if (userResponse.ok && facultyResponse.ok && challengeResponse.ok) {
        const userData = await userResponse.json();
        const facultyData = await facultyResponse.json();
        const challengeData = await challengeResponse.json();
  
        setUserCount(userData.users);
        setFacultyCount(facultyData.faculties); // Assuming the faculty count is also provided in the "users" field
        setChallengeCount(challengeData.challenges);
      } else {
        throw new Error('Failed to fetch stats data.');
      }
    } catch (error) {
      console.error('Error fetching stats data:', error);
      alert('An error occurred while fetching stats data.');
    }
  };


  useEffect(() => {
    fetchDataAndCreateChart();
    fetchStats();
  }, [showLeaderboard]);

  return (
    <div>
      <NavBar pageName="Admin Panel" onSetActivePage={setActivePage} />
      <div className="admin-panel">
        <div className="admin-left">
          {showLeaderboard && (
            <div className="leaderboard">
              <canvas id="leaderboard-chart" ref={chartRef} className="leaderboard-chart"></canvas>
            </div>
          )}

          <div className="subject-input">
            <h2><font color= '#ADD8E6'>Add New Subject</font></h2>
            <div>
              <label htmlFor="subjectName">Subject Name:</label>
              <input
                type="text"
                id="subjectName"
                value={name}
                style={{ fontSize: '18px' }}
                onChange={(e) => setSubjectName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="subjectCode">Subject Code:</label>
              <input
                type="text"
                id="subjectCode"
                value={subject_code}
                style={{ fontSize: '18px' }}
                onChange={(e) => setSubjectCode(e.target.value)}
              />
            </div>
            <button onClick={handleSubjectSubmit}>Submit</button>
          </div>
        </div>

        <div className="admin-right">

          <div className="admin-section">
            <h2>Verify Faculty</h2>
            <button onClick={toggleFacultyVerification}>Verify Faculty</button>

            {showFacultyVerification && (
              <div className="popup-background">
                <div className="popup-content">
                  <FacultyVerificationDashboard onClose={closeFacultyVerification} />
                </div>
              </div>
            )}
          </div>
          <div className="admin-section">
            <h2>Statistics</h2>
            <div className="curved-box total-registered-users">Total Student Registered: {userCount}</div>
            <div className="curved-box total-challenges">Total Challenges: {challengeCount}</div>
            <div className="curved-box total-submissions">Total Faculty Registration: {facultyCount}</div>
          </div>
          <div className="admin-section">
            <h2>Leaderboard Control</h2>
            <button onClick={toggleLeaderboard}>
              {showLeaderboard ? 'Hide Leaderboard' : 'Show Leaderboard'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
