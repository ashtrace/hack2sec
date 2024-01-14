import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';
import './Dashboard.css';
import './DonutChartStyles.css';
import NavBar from './Nav_bar';

const CTFDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [challengesSolvedChart, setChallengesSolvedChart] = useState(null);
  const [categoriesSolvedChart, setCategoriesSolvedChart] = useState(null);
  const [activePage, setActivePage] = useState(''); 
  document.body.style.overflow = 'hidden';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem('AccessToken');
        const response = await fetch('http://localhost:1337/api/stats/user-dashboard', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          console.error('Failed to fetch user stats.');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (userData) {
      // Destroy existing charts
      challengesSolvedChart && challengesSolvedChart.destroy();
      categoriesSolvedChart && categoriesSolvedChart.destroy();

      // Create new charts
      const challengesSolvedChartInstance = new Chart(document.getElementById('challengesSolvedChart'), {
        type: 'doughnut',
        data: getChallengesSolvedData(userData),
        options: getChartOptions(),
      });

      const categoriesSolvedChartInstance = new Chart(document.getElementById('categoriesSolvedChart'), {
        type: 'doughnut',
        data: getCategoriesSolvedData(userData),
        options: getChartOptions(),
      });

      // Save chart instances to state
      setChallengesSolvedChart(challengesSolvedChartInstance);
      setCategoriesSolvedChart(categoriesSolvedChartInstance);
    }
  }, [userData]);

  const getChallengesSolvedData = (userData) => {
    return {
      labels: ['Correct', 'Incorrect'],
      datasets: [
        {
          data: [userData.correctSolves, userData.incorrectSolves],
          backgroundColor: ['darkgreen', 'red'],
        },
      ],
    };
  };

  const getCategoriesSolvedData = (userData) => {
    return {
      labels: Object.keys(userData.categoryCounts),
      datasets: [
        {
          data: Object.values(userData.categoryCounts),
          backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0'],
        },
      ],
    };
  };

  const getChartOptions = () => {
    return {
      responsive: true,
      cutout: '75%',
      plugins: {
        legend: {
          display: false,
        },
      },
    };
  };

  const getFormattedTimestamp = (timestamp) => {
    const dateObject = new Date(timestamp);
    const formattedDate = dateObject.toDateString();
    const formattedTime = dateObject.toLocaleTimeString();

    return `${formattedDate} ${formattedTime}`;
  };

  return (
    <div className="ctf-dashboard-container">
      <div className="dashboard-content">
        {/* User Dashboard (left side) */}
        <div className="ctf-content">
          
          <NavBar pageName="User Dashboard" onSetActivePage={setActivePage} />
          {/* <div className="hacker-animation"></div> */}
          <h1>Welcome to the CTF Dashboard</h1>
          <div className="player-info">
            <h2>{userData?.name}</h2>
            <h2>{userData?.username}</h2>
            <h2>{userData?.rank}</h2>
            <h2>{userData?.points}</h2>
          </div>
          <div className="graph">
            <canvas id="challengesSolvedChart" style={{ width: '200px', height: '200px' }}></canvas>
            <h3 className="white-text">Challenges Solved</h3>
          </div>
          <div className="graph">
            <canvas id="categoriesSolvedChart" style={{ width: '200px', height: '200px' }}></canvas>
            <h3 className="white-text">Categories Solved</h3>
          </div>
        </div>

        {/* Challenge table (right side) */}
        <div className="challenges-table">
          <h2>Solved Challenge Details</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Points</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {userData?.solvedChallenges.map((challenge, index) => (
                <tr key={index}>
                  <td>{challenge.name}</td>
                  <td>{challenge.points}</td>
                  <td>{getFormattedTimestamp(challenge.timeStamp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CTFDashboard;
