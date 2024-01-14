import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import { jwtDecode } from 'jwt-decode';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import ChallengesDashboard from './components/ChallengesDashboard';
import NavBar from './components/Nav_bar';
import CTFLeaderboard from './components/CTFLeaderboard';
import AdminPanel from './components/AdminPanel';
import CTFChallengeForm from './components/CreateChallenge';
import ChallengeEdit from './components/ChallengeEdit';
import StudentRegisterForm from './components/StudentRegistration';
import FacultyRegisterForm from './components/FacultyRegisterForm';
import FacultyChallengeEdit from './components/FacultyChallengeEdit';
import Hacker404 from './components/404';

const App = () => {
  // State to track the user's login status and role
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');

  // useEffect to check the user's login status and role
  useEffect(() => {
    const accessToken = localStorage.getItem('AccessToken');
    if (accessToken) {
      try {
        const decodedToken = jwtDecode(accessToken);
        const userRole = decodedToken.UserInfo.role;

        setLoggedIn(true);
        setUserRole(userRole);
      } catch (error) {
        // Handle invalid token gracefully, e.g., log out the user
        console.error('Error decoding token:', error);
        handleLogout();
      }
    }
  }, []);

  const handleLogin = (target) => {
    // Do something when login is successful
    console.log('Logged in as', target);

    // Set the login status to true
    setLoggedIn(true);

    // Redirect to the dashboard or the appropriate page based on the role
    return <Navigate to={getRedirectPathBasedOnRole(userRole)} />;
  };

  const handleLogout = () => {
    // Clear the access token and user role from local storage
    localStorage.removeItem('AccessToken');
    // Set the login status to false
    setLoggedIn(false);

    // Redirect to the login page
    return <Navigate to="/login" />;
  };

  // Helper function to get the redirect path based on the user's role
  const getRedirectPathBasedOnRole = (role) => {
    console.log(role);
    switch (role) {
      case '65aa8d5e27092546f7951234':
        return '/admin';
      case '65cc8d5e27096246f7954321':
        return '/my-challenges';
      default:
        return '/leaderboard';
    }
  };
  

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={isLoggedIn ? <Navigate to={getRedirectPathBasedOnRole(userRole)} /> : <LoginForm onLogin={handleLogin} />}
        />
        {!isLoggedIn && (
          <>
            <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
            <Route path="/register" element={<StudentRegisterForm />} />
            <Route path="/register-faculty" element={<FacultyRegisterForm />} />
            <Route path="*" element={<LoginForm onLogin={handleLogin} />} />
            
          </>
        )}

        {/* Private routes requiring login */}
        {isLoggedIn && (
          <>
            <Route path="*" element={<Hacker404 />} />
            <Route path="/login" element={<Navigate to={getRedirectPathBasedOnRole(userRole)} />} />
            <Route path="/register" element={<Navigate to={getRedirectPathBasedOnRole(userRole)} />} />
            <Route path="/register-faculty" element={<Navigate to={getRedirectPathBasedOnRole(userRole)} />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/challenges" element={<ChallengesDashboard />} />
            <Route path="/leaderboard" element={<CTFLeaderboard />} />

            {/* Admin routes */}
            {userRole === '65aa8d5e27092546f7951234' && (
              <>
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/create-challenge" element={<CTFChallengeForm />} />
                <Route path="/leaderboard" element={<CTFLeaderboard />} />
                <Route path="/edit-challenge" element={<ChallengeEdit />} />
              </>
            )}

            {/* Faculty routes */}
            {userRole === '65cc8d5e27096246f7954321' && (
              <>
                <Route path="/my-challenges" element={<FacultyChallengeEdit />} />
                <Route path="/create-challenge" element={<CTFChallengeForm />} />
                <Route path="/edit-challenge" element={<ChallengeEdit />} />
              </>
            )}
          </>
        )}

        <Route path="/logout" element={<LoginForm onLogin={handleLogin} />} />
        
      </Routes>
    </Router>
  );
};
export default App;
