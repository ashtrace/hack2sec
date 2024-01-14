import React, { useState, useEffect } from 'react';
import './ChallengeEdit.css';
import Nav_bar from './Nav_bar';
import CTFChallengeForm from './UpdateChallenge'; 
import './Popup.css'; 

const ChallengesDashboard = () => {
  const [activePage, setActivePage] = useState('');
  const [challenges, setChallenges] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [flagInput, setFlagInput] = useState('');
  const [showFlag, setShowFlag] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [challengeData, setChallengeData] = useState(null);
  document.body.style.overflow = 'hidden';




  useEffect(() => {
    const token = localStorage.getItem('AccessToken');

    if (!token) {
      alert('Authentication token not found in localStorage. Please log in.');
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const fetchChallenges = async () => {
      try {
        const response = await fetch('http://localhost:1337/api/challenges', { headers });

        if (response.status === 200) {
          const data = await response.json();
          setChallenges(data);
        } else {
          throw new Error('Failed to fetch challenges.');
        }
      } catch (error) {
        console.error('Error fetching challenges:', error);
        alert('An error occurred while fetching challenges.');
      }
    };

    fetchChallenges();
  }, []);
  const uniqueCategories = [...new Set(challenges.map(challenge => challenge.category))];
  const categories = ['All', ...uniqueCategories];

  const openEditForm = async (challenge) => {
    const token = localStorage.getItem('AccessToken');
  
    if (!token) {
      alert('Authentication token not found in localStorage. Please log in.');
      return;
    }
  
    const headers = {
      Authorization: `Bearer ${token}`,
    };
  
    try {
      const response = await fetch(`http://localhost:1337/api/challenges/${challenge._id}`, {
        headers,
      });
  
      if (response.status === 200) {
        const data = await response.json();
        // Add the challenge_id to the challengeData
        data.challenge_id = challenge._id;
        setChallengeData(data);
        setShowEditForm(true);
      } else {
        throw new Error('Failed to fetch challenge details.');
      }
    } catch (error) {
      console.error('Error fetching challenge details:', error);
      alert('An error occurred while fetching challenge details.');
    }
  };
  
  const deleteChallenge = async (challengeId) => {
    const token = localStorage.getItem('AccessToken');
  
    if (!token) {
      alert('Authentication token not found in localStorage. Please log in.');
      return;
    }
  
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  
    const requestBody = {
      challenge_id: challengeId,
    };
  
    try {
      const response = await fetch('http://localhost:1337/api/challenges', {
        method: 'DELETE',
        headers,
        body: JSON.stringify(requestBody),
      });
  
      if (response.status === 200) {
        // Remove the deleted challenge from the state
        setChallenges((prevChallenges) => prevChallenges.filter((challenge) => challenge._id !== challengeId));
        alert('Challenge deleted successfully!');
      } else {
        throw new Error('Failed to delete the challenge.');
      }
    } catch (error) {
      console.error('Error deleting the challenge:', error);
      alert('An error occurred while deleting the challenge.');
    }
  };
  
  

  // Function to close the edit form popup
  const closeEditForm = () => {
    setSelectedChallenge(null);
    setShowEditForm(false);
  };

  // Function to filter challenges by category
  const filterChallenges = (category) => {
    setSelectedCategory(category);
  };

  // Function to show challenge details in a modal
  const showChallengeDetails = (challenge) => {
    setSelectedChallenge(challenge);
    setShowFlag(true);
  };


  // Function to close the challenge details modal
  const handleCloseModal = () => {
    setSelectedChallenge(null);
    setShowFlag(false);
  };


  
  return (
    <div>
      
      
      <Nav_bar pageName="Edit Challenges" onSetActivePage={setActivePage} />
      <div className="challenges-dashboard">
      <div className="category-buttons">
          {categories.map((category) => (
            <button
              key={category}
              className={selectedCategory === category ? 'selected' : ''}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
       <div className="challenges-container">
          <div className="challenges-list">
        {challenges
          .filter((challenge) => selectedCategory === 'All' || challenge.category === selectedCategory)
          .map((challenge) => (
            <div key={challenge._id} className="challenge-container">
              <div className="challenge">
                <h3>{challenge.name}</h3>
                <p>{challenge.points} Points</p>
                <button onClick={() => openEditForm(challenge)} className="View-detail">
                  Edit
                </button>
                <button onClick={() => deleteChallenge(challenge._id)} className="View-detail">
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>
        {showFlag && selectedChallenge && (
          <div className="challenge-popup">
            
          </div>
        )}
        
      </div>
      
      {showEditForm && challengeData && (
  <div className="popup-container">
    <div className="popup-content">
      <CTFChallengeForm
        challengeData={challengeData} // Pass the challengeData as a prop
        onClose={closeEditForm}
      />
      {/* <button onClick={closeEditForm}>Close</button> */}
    </div>
  </div>
)}

      </div>
    </div>
  );
};

export default ChallengesDashboard;
