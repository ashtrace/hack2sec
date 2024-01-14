import React, { Component } from 'react';
import './UpdateChallenge.css';
import axios from 'axios';
import NavBar from './Nav_bar';

class CTFChallengeForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      challenge_id: '',
      name: '',
      description: '',
      points: '',
      subject_id: '',
      flag: '',
      hint: '',
      url: '',
      attachment: [],
      isAttachmentUploaded: false,
      successMessage: '',
      filename: '',
      isSubmitEnabled: false,
      filename: '',
      topic: '',
      resource: '',
      category: '',
      subjects: [],
      categories: [],
      hint_enabled: true,
      originalData: null, // Store the original data for comparison
    };
    document.body.style.overflow = 'hidden';
  }

  handleClose = () => {
    document.body.style.overflow = 'auto'; // Restore the overflow style
    this.props.onClose(); // Call the onClose function passed from the parent component
  };

  componentDidMount() {
    this.fetchSubjects();
    this.loadCategories();

    

    // Check if challengeData is provided in the props
    if (this.props.challengeData) {
      this.autofillFields(this.props.challengeData);
    }

  }

  autofillFields = (challengeData) => {
    if (challengeData) {
      console.log(challengeData);
      const {
        challenge_id,
        name,
        description,
        points,
        subject_id,
        flag,
        hint,
        url,
        category,
        hintEnabled, // Updated the field name to match the API response
        topic,
        resource,
        filename,
      } = challengeData;

      console.log("Hint Enabled (from API):", challengeData.hint_enabled);
  
      this.setState({
        challenge_id: challenge_id || '',
        name: name || '',
        description: description || '',
        points: points || '',
        subject_id: subject_id || '',
        flag: flag || '',
        hint: hint || '',
        url: url || '',
        category: category || '',
        hint_enabled: challengeData.hint_enabled, 
        topic: topic || '',
        resource: resource || '',
        filename: filename || '',
        originalData: { ...challengeData },
      });
    }
  };
  

  fetchSubjects = async () => {
    try {
      const token = localStorage.getItem('AccessToken');
      if (!token) {
        alert('Authentication token not found in localStorage. Please log in.');
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get('http://localhost:1337/api/subjects', { headers });

      if (response.status === 200) {
        const subjects = response.data;
        this.setState({ subjects });
      } else {
        alert('Failed to fetch subjects.');
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
      alert('An error occurred while fetching subjects.');
    }
  };

  loadCategories = () => {
    const temporaryCategories = [
      'Binary Exploitation',
      'Crypto',
      'Cloud Security',
      'Forensics',
      'IoT Security',
      'Mobile Security',
      'Network Security',
      'Pwn',
      'Reverse Engineering',
      'Steganography',
      'Web Security',
    ];
    this.setState({
      categories: temporaryCategories,
    });
  };

  handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
  
    // Handle the boolean input for hint_enabled
    if (type === 'radio' && name === 'hint_enabled') {
      this.setState({ hint_enabled: checked }, () => {
        this.validateForm();
      });
    } else if (name === 'attachment' && value) {
      // Handle input change for the "attachment" field
      this.setState({ attachment: [value] }, () => {
        this.validateForm();
      });
    } else if (name === 'hint') {
      // Handle input change for the "hint" field
      this.setState({ hint: value }, () => {
        this.validateForm();
      });
    } else {
      // Handle other input changes
      this.setState({ [name]: value }, () => {
        this.validateForm();
      });
    }
  };
  

  handleAttachmentChange = (event) => {
    this.setState({ attachment: [...event.target.files] }, () => {
      this.validateForm();
    });
  };

  handleAttachmentUpload = () => {
    if (this.state.attachment.length > 0) {
      const token = localStorage.getItem('AccessToken');
      if (!token) {
        alert('Authentication token not found in localStorage. Please log in.');
        return;
      }

      const formData = new FormData();
      this.state.attachment.forEach((file, index) => {
        formData.append(`attachment_${index}`, file);
      });

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      };

      axios
        .post('http://127.0.0.1:1337/api/challenges/upload', formData, config)
        .then((response) => {
          if (response.status === 200) {
            const { filename } = response.data;
            this.storeFilename(filename);
            this.setState({
              isAttachmentUploaded: true,
              successMessage: 'Attachment uploaded successfully!',
            });
            alert('Attachment uploaded successfully!');
            this.validateForm();
          } else {
            alert('Failed to upload the attachment.');
          }
        })
        .catch((error) => {
          console.error('Error uploading attachment:', error);
          alert('An error occurred while uploading the attachment.');
        });
    } else {
      alert('Please select at least one file to upload.');
    }
  };

  storeFilename = (filename) => {
    this.setState({
      filename: filename,
    });
  };

  validateForm = () => {
    const { originalData, hint_enabled, ...currentState } = this.state;

    const isSubmitEnabled = Object.keys(currentState).some((key) => {
      if (originalData[key] !== undefined) {
        return currentState[key] !== originalData[key];
      }
      return currentState[key] !== '';
    });

    this.setState({ isSubmitEnabled });
  };

  handleSubmit = async () => {
    const {
      challenge_id, // Include the _id here
      name,
      description,
      category,
      points,
      subject_id,
      flag,
      hint,
      url,
      filename,
      topic,
      resource,
      hint_enabled,
      originalData,
    } = this.state;
  
    if (this.state.isSubmitEnabled) {
      const token = localStorage.getItem('AccessToken');
  
      if (!token) {
        alert('Authentication token not found in localStorage. Please log in.');
        return;
      }
  
      if (url && filename) {
        alert('Please provide either a URL or an attachment, not both.');
        return;
      }
  
      const jsonData = {
        challenge_id, // Include the _id in the request
        category,
        description,
        points,
        subject_id,
        hint_enabled,
        hint,
        topic,
        resource,
        filename,
      };
  
      // Check if the name is changed, then include it in the request
      if (name !== originalData.name) {
        jsonData.name = name;
      }

      if (flag.trim() !== '') {
        jsonData.flag = flag.trim();
      }
  
      if (url) {
        jsonData.url = url;
      }
  
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      };
  
      try {
        const response = await axios.put('http://localhost:1337/api/challenges', jsonData, config);
        if (response.status === 200) {
          this.setState({
            originalData: { ...jsonData },
            name: '',
            description: '',
            points: '',
            subject_id: '',
            flag: '',
            hint: '',
            url: '',
            attachment: [],
            isAttachmentUploaded: false,
            successMessage: 'Form submitted successfully!',
            filename: '',
            isSubmitEnabled: false,
          });
          alert('Challenge Updated Successfully');
        } else {
          alert('Failed to submit the form.');
        }
      } catch (error) {
        console.error('Error submitting the form:', error);
        alert('An error occurred while submitting the form.');
      }
    } else {
      alert('Please fill in all required fields and provide either URL or upload a file.');
    }
  };
  

  render() {
    const {
      name,
      description,
      points,
      subject_id,
      flag,
      hint,
      url,
      topic,
      resource,
      category,
      subjects,
      categories,
      hint_enabled,
      attachment,
      isSubmitEnabled,
      filename,
      successMessage,
    } = this.state;
   return (
        <div className="ctf-form12">
          <h1>Update Challenge Details</h1>
          <div className="form-table">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Challenge Name"
                  value={name}
                  onChange={this.handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <input
                  type="text"
                  name="description"
                  placeholder="Break To Hack"
                  value={description}
                  onChange={this.handleInputChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="points">Points</label>
                <input
                  type="number"
                  name="points"
                  placeholder="500"
                  value={points}
                  onChange={this.handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="flag">Flag</label>
                <input
                  type="text"
                  name="flag"
                  placeholder="Hack2Sec{21232f297a57a5a743894a0e4a801fc3}"
                  value={flag}
                  onChange={this.handleInputChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="subject_id">Subject</label>
                <select name="subject_id" value={subject_id} onChange={this.handleInputChange}>
                  <option value="">Select a Subject</option>
                  {subjects.map((subject) => (
                    <option key={subject._id} value={subject._id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="topic">Topic</label>
                <input
                  type="text"
                  name="topic"
                  placeholder="SQL Injection"
                  value={topic}
                  onChange={this.handleInputChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select name="category" value={category} onChange={this.handleInputChange}>
                  <option value="">Select a Category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="resource">Resource</label>
                <input
                  type="text"
                  name="resource"
                  placeholder="Challenge Resource Link"
                  value={resource}
                  onChange={this.handleInputChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="hint">Hint</label>
                <input
                  type="text"
                  name="hint"
                  placeholder="Challenge Hint"
                  value={hint}
                  onChange={this.handleInputChange}
                  className="hint-input"
                />
              </div>

              <div className="form-group toggle-button">
              <input
              type="radio"
              name="hint_enabled"
              id="hintVisible"
              value={true} // Updated to boolean true
              checked={hint_enabled === true}
              onChange={this.handleInputChange}
            />
            <label htmlFor="hintVisible">Hint Visible</label>

            <input
              type="radio"
              name="hint_enabled"
              id="hintInvisible"
              value={false} // Updated to boolean false
              checked={hint_enabled === false}
              onChange={this.handleInputChange}
            />
            <label htmlFor="hintInvisible">Hint Invisible</label>

              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <div className="attachment-section">
                  <label htmlFor="attachment">Attachment</label>
                  <input
                    type="file"
                    name="attachment"
                    accept="image/*, application/pdf"
                    onChange={this.handleAttachmentChange}
                    multiple
                  />
                              

                  <button onClick={this.handleAttachmentUpload}>Upload Attachment</button>
                      
                </div>
                
             
              </div>

              <div className="form-group">
                <label htmlFor="url">URL</label>
                <input
                  type="text"
                  name="url"
                  placeholder="Challenge URL"
                  value={url}
                  onChange={this.handleInputChange}
                />
              </div>
            </div>

                      
          </div>
          
    
    <div>
    
      </div>
          {filename && (
              <div className="form-group">
                <p>
                <label>Attachment Filename:</label>
                
                <span>{filename}</span>
                </p></div>
              
            )}
           
          <div className="buttons-row">
  {isSubmitEnabled && (
    <button className="submit-button" onClick={this.handleSubmit}>
      Submit
    </button>
  )}
  <button className="close-button" onClick={this.handleClose}>
    Close
  </button>
</div>

        </div>
        
      
    );
  }
}

export default CTFChallengeForm;
