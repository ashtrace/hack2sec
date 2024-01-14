import React, { useState, useEffect } from 'react';
import './ChallengesDashboard.css';
import './Nav_bar';
import Nav_bar from './Nav_bar';
import './Nav_bar.css';

const ChallengesDashboard = () => {
  const [activePage, setActivePage] = useState('');
  const [challenges, setChallenges] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [flagInput, setFlagInput] = useState('');
  const [showFlag, setShowFlag] = useState(false);
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

    
    fetch('http://localhost:1337/api/challenges', { headers })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error('Failed to fetch challenges.');
        }
      })
      .then((data) => {
        setChallenges(data); // Set the challenges state with the API response data
      })
      .catch((error) => {
        console.error('Error fetching challenges:', error);
        alert('An error occurred while fetching challenges.');
      });
  }, []); 
  const uniqueCategories = [...new Set(challenges.map(challenge => challenge.category))];
  const categories = ['All', ...uniqueCategories];


 
  const handleDownloadOrOpenUrl = () => {
    const attachments = selectedChallenge.attachments;

    if (attachments && attachments.files) {
      // If files are present, trigger file download
      handleDownloadFile();
    } else if (attachments && attachments.url) {
      // If URL is present, open the URL in a new tab
      window.open(attachments.url, '_blank');
    } else {
      alert('No files or URL available for this challenge.');
    }
  };

    // Function to show challenge details in a modal
  const showChallengeDetails = (challenge) => {
    setSelectedChallenge(challenge);
    setShowFlag(true);
  };

  // Function to handle flag submission
  const handleSubmitFlag = () => {
    validateFlag();
    setFlagInput('');
  };

  const validateFlag = () => {
    const token = localStorage.getItem('AccessToken');
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const data = {
      challenge_id: selectedChallenge._id,
      flag: flagInput,
    };

    // Make an API call to validate the flag
    fetch('http://localhost:1337/api/challenges/validate', {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.status === 200) {
          
          alert('Flag is correct!');
          return response.json();
                
        }
        else if (response.status === 304) {
          // Handle 304 status code (Not Modified)
          alert('Challenge is Already Solved');
          
        }
        
        else if (response.status === 400) {
          // Handle 304 status code (Not Modified)
          alert('Flag is Incorrect!');
          
        }
        
        else {
          throw new Error('Flag is Incorrect!');
        }
      })

      .catch((error) => {
        console.error('Error validating flag:', error);
        alert('An error occurred while validating the flag.');
      });
  };


  // Function to unlock the hint
// Function to unlock the hint
const unlockHint = () => {
  // Ask for confirmation
  if (window.confirm('Are you sure you want to unlock the hint?')) {
    // Get the challenge ID
    const challengeId = selectedChallenge._id;

    // Get the access token from localStorage
    const token = localStorage.getItem('AccessToken');

    // Make a GET request to the hint endpoint
    fetch(`http://localhost:1337/api/challenges/hint/${challengeId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        if (response.status === 402) {
          alert("User does not have enough points to unlock this hint.")
          return  
        }
        if (response.status === 403) {
          alert("Hint for this Challenge is diabled!!")
          return  
        }

        else {
          throw new Error('Failed to unlock hint.');
        }
      })
      .then((data) => {
        // Extract the hint from the API response
        const hint = data.message;

        // Update the selected challenge with the unlocked hint
        setSelectedChallenge({ ...selectedChallenge, hintUnlocked: true, hint });
      })
      .catch((error) => {
        console.error('Error unlocking hint:', error);
      });
  }
};


  // Function to close the challenge details modal
  const handleCloseModal = () => {
    setSelectedChallenge(null);
    setShowFlag(false);
  };


  const handleDownloadFile = () => {
    const attachments = selectedChallenge.attachments;
  
    if (attachments && attachments.files) {
      const fileName = attachments.files;
      console.log(attachments.files)
      const token = localStorage.getItem('AccessToken');
      const headers = {
        Authorization: `Bearer ${token}`,
      };
  
      // Make an API call to download the file
      fetch(`http://localhost:1337/api/challenges/download/${fileName}`, { headers })
        .then((response) => {
          if (response.status === 200) {
            // If the response is successful, trigger the file download
            response.blob().then((blob) => {
              const url = window.URL.createObjectURL(new Blob([blob]));
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', fileName);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            });
          } else {
            throw new Error('Failed to download file.');
          }
        })
        .catch((error) => {
          console.error('Error downloading file:', error);
          alert('An error occurred while downloading the file.');
        });
    } else {
      alert('File name not available for download.');
    }
  };

  return (
    <div>
    <Nav_bar pageName="Challenges Dashboard" onSetActivePage={setActivePage} />
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
                    <button onClick={() => showChallengeDetails(challenge)} className="View-detail">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      {showFlag && (
        <div className="challenge-popup">
          <div className="challenge-popup-content">
            <h2>Challenge Details</h2>
            <p>
              <span className="param-name">Name:</span> {selectedChallenge.name}
            </p>
            <p>
              <span className="param-name">Description:</span> {selectedChallenge.description}
            </p>
            <p>
              <span className="param-name">Points:</span> {selectedChallenge.points}
            </p>
            {/* <p>
              <span className="param-name">Subject:</span> {selectedChallenge.subject}
            </p> */}
            <p>
              <span className="param-name">Topic :</span> {selectedChallenge.topic}
            </p>
            <p>
              <span className="param-name">Resource</span> {selectedChallenge.resource}
            </p>
            <button onClick={handleDownloadOrOpenUrl}>
                {selectedChallenge.attachments.files ? 'Download' : 'URL'}
              </button>
            <button onClick={unlockHint}>Hint</button> 
            {selectedChallenge.hintUnlocked && ( // Display hint if unlocked
              <p>
                <span className="param-name">Hint:</span> {selectedChallenge.hint}
              </p>
            )}
            <input
                type="text"
                placeholder="Enter Flag"
                value={flagInput}
                onChange={(e) => setFlagInput(e.target.value)}
              />
              <button onClick={handleSubmitFlag}>Submit Flag</button>
            <button onClick={handleCloseModal}>Close</button>
            
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default ChallengesDashboard;
