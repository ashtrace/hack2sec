// NavBar.js
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { jwtDecode } from 'jwt-decode';
import PropTypes from 'prop-types';
import './Nav_bar.css'; // Make sure to adjust the import based on your actual file structure
import LoginForm from './LoginForm';

function NavBar({ pageName, onSetActivePage,  }) {
  const accessToken = localStorage.getItem('AccessToken');
  const decodedToken = jwtDecode(accessToken); // Update function name
  const userId = decodedToken.UserInfo.role;

  
  const navigate = useNavigate();

  const handleChallengesClick = () => {
    onSetActivePage('ChallengesDashboard');
  };

const handleLogout = () => {
  // Clear the access token from local storage
  localStorage.removeItem('AccessToken');
  alert("Logout Successfully !!");
    };
  
  return (
    <div>
      <nav className="ctf-nav">
      <div className="hack2hec" style={{ fontSize: 48 }}>{pageName}</div>
        <ul>
        
          {userId === '65aa8d5e27092546f7951234' && (
            <>
              <li><a href="/challenges" onClick={handleChallengesClick}>Challenges</a></li>
              <li><a href="/leaderboard" onClick={() => onSetActivePage('CTFLeaderboard')}>Leaderboard</a></li>
              <li><a href="/admin" onClick={() => onSetActivePage('AdminPanel')}>Admin-Panel</a></li>
              <li><a href="/create-challenge" onClick={() => onSetActivePage('CTFChallengeForm')}>Create-Challenge</a></li>
              <li><a href="/edit-challenge" onClick={() => onSetActivePage('ChallengeEdit')}>Edit-Challenges</a></li>
            </>
          )}

          {userId === '65cc8d5e27096246f7954321' && (
            <>
              <li><a href="/challenges" onClick={handleChallengesClick}>Challenges</a></li>
              <li><a href="/leaderboard" onClick={() => onSetActivePage('CTFLeaderboard')}>Leaderboard</a></li>
              <li><a href="/create-challenge" onClick={() => onSetActivePage('CTFChallengeForm')}>Create-Challenges</a></li>
              <li><a href="/my-challenges" onClick={() => onSetActivePage('ChallengeEdit')}>My-Challenges</a></li>
            </>
          )}

          {userId === '65ff8d5e27094946f7951221' && (
            <>
              <li><a href="/dashboard" onClick={() => onSetActivePage('Dashboard')}>Dashboard</a></li>
              <li><a href="/challenges" onClick={handleChallengesClick}>Challenges</a></li>
              <li><a href="/leaderboard" onClick={() => onSetActivePage('CTFLeaderboard')}>Leaderboard</a></li>
            </>
          )}

<li>
  <a href="/logout" onClick={() => { handleLogout(); }}>
    Logout
  </a>
</li>
        </ul>
      </nav>
    </div>
  );
}


NavBar.propTypes = {
  pageName: PropTypes.string.isRequired,
  onSetActivePage: PropTypes.func,
  handleLogout: PropTypes.func,
};


export default NavBar;
