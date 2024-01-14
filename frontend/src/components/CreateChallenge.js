import React, { Component } from 'react';
import './CreateChallenge.css';
import axios from 'axios';
import NavBar from './Nav_bar';

class CTFChallengeForm extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
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
      topic: '', 
      resource: '', 
      category: '',
      subjects: [],
      categories: [],
      hint_enabled: 'visible', 
      setActivePage: this.props.setActivePage,
    };
    document.body.style.overflow = 'hidden';


  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'attachment' && value) {
      // Handle input change for the "attachment" field
      this.setState({ attachment: [value] }, () => {
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
    const { name, description, points, subject_id, flag, hint, url, attachment, topic, resource } = this.state;

    const isSubmitEnabled =
      name &&
      description &&
      points &&
      subject_id &&
      flag &&
      hint &&
      (url || attachment.length > 0) &&
      topic && // Ensure topic is not empty
      resource; // Ensure resource is not empty

    this.setState({ isSubmitEnabled });
  };

  handleSubmit = async () => {
    const { name, description, category, points, subject_id, flag, hint, url, filename, topic, resource, hint_enabled } = this.state;
  
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
        name,
        category,
        description,
        points,
        subject_id,
        flag,
        hint_enabled,
        hint,
        topic,
        resource,
        filename, // Use the "filename" field
      };
  
      if (url) {
        jsonData.url = url;
      }
  
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };
  
      try {
        const response = await axios.post('http://localhost:1337/api/challenges', jsonData, config);
        if (response.status === 201) {
          this.setState({
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
            filename: '', // Clear the "filename" field
            isSubmitEnabled: false,
          });
  
          alert('Challenge Created Successfully');
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
  

  componentDidMount() {
    const token = localStorage.getItem('AccessToken');

    if (!token) {
      alert('Authentication token not found in localStorage. Please log in.');
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    axios
      .get('http://localhost:1337/api/subjects', { headers })
      .then((response) => {
        if (response.status === 200) {
          const subjects = response.data;
          this.setState({ subjects });
        } else {
          alert('Failed to fetch subjects.');
        }
      })
      .catch((error) => {
        console.error('Error fetching subjects:', error);
        alert('An error occurred while fetching subjects.');
      });

    const temporaryCategories = [
      { name: 'Binary Exploitation' },
      { name: 'Crypto' },
      { name: 'Cloud Security' },
      { name: 'Forensics' },
      { name: 'IoT Security' },
      { name: 'Mobile Security' },
      { name: 'Network Security' },
      { name: 'Reverse Engineering' },
      { name: 'Steganography' },
      { name: 'Web Security' },
    ];
    this.setState({
      categories: temporaryCategories,
    });
  }

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
      attachment,
      isSubmitEnabled,
      category,
      subjects,
      categories,
      hint_enabled, // Added hint_enabled to state
    } = this.state;

    return (
      <div>
        {/* <NavBar pageName="Challenge Creation" /> */}
        <NavBar pageName="Challenge Creation" onSetActivePage={this.state.setActivePage} />
        <div className="ctf-form12">
          <h2>Challenge Details</h2>
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
                    <option key={category.name} value={category.name}>
                      {category.name}
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
                  value="true"
                  checked={hint_enabled === 'true'} // Check the appropriate radio button
                  onChange={this.handleInputChange}
                />
                <label htmlFor="hintVisible">Hint Visible</label>

                <input
                  type="radio"
                  name="hint_enabled"
                  id="hintInvisible"
                  value="false"
                  checked={hint_enabled === 'false'} // Check the appropriate radio button
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

            {isSubmitEnabled ? (
              <div className="submit-button1">
                <button onClick={this.handleSubmit}>Submit</button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

export default CTFChallengeForm
