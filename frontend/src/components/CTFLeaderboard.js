import React, { useEffect, useRef, useState } from 'react';
import './CTFLeaderboard.css'; 
import Chart from 'chart.js/auto';
import NavBar from './Nav_bar'; 

const CTFLeaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState('');
  document.body.style.overflow = 'hidden';

  const chartRef = useRef(null); 
  const chartInstanceRef = useRef(null); 

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const accessToken = localStorage.getItem('AccessToken');
        const response = await fetch('http://localhost:1337/api/stats/leaderboard', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setLeaderboardData(data);
        } else {
          // Handle error
          console.error('Failed to fetch leaderboard data');
        }
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []);

  useEffect(() => {
    const createChart = () => {
      if (leaderboardData && leaderboardData.labels && leaderboardData.labels.length > 0) {
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy(); 
        }

        const userNames = leaderboardData.leaderboardData.map((entry) => entry.username);

        const datasets = userNames.map((userName, index) => ({
          label: userName,
          data: leaderboardData.leaderboardData.find((entry) => entry.username === userName).scores,
          borderColor: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
            Math.random() * 256
          )}, ${Math.floor(Math.random() * 256)}, 1)`,
          borderWidth: 2,
          fill: false,
          
        }));

        
        const dateLabels = leaderboardData.labels.map((date) => {
          if (date && date.match(/\d{2}\/\d{2}\/\d{4}/)) {
            const [month, day, year] = date.split('/');
            return `${day}/${month}/${year}`;
          }
          return '';
        });
        
        const newChartInstance = new Chart(chartRef.current, {
          type: 'line',
          data: {
            labels: dateLabels,
            datasets,
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
      }
    };

    createChart(); 

    return () => {
      // Cleanup and destroy the chart when the component unmounts
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [leaderboardData]);

  return (
    <div className="ctf-leaderboard">
      <NavBar pageName="Leaderboard" onSetActivePage={setActivePage} />
      <header>
        {/* <h1>CTF Leaderboard</h1> */}
      </header>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="performance-graph">
            <canvas ref={chartRef} className="performance-chart"></canvas>
          </div>
          <div className="leaderboard-table">
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Player</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData.leaderboardData.map((player, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{player.username}</td>
                    <td>{player.scores[player.scores.length - 1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default CTFLeaderboard;
