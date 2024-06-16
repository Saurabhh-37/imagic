import React, { useState } from 'react';
import { useSpeechSynthesis } from 'react-speech-kit';
import './App.css'; // Import your CSS file for styling

function App() {
  const [message, setMessage] = useState('');
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [error, setError] = useState('');
  const { speak, voices } = useSpeechSynthesis();
  const [imageUrl, setImageUrl] = useState('');
  const [checkboxes, setCheckboxes] = useState({
    description: false,
    caption: false,
    hashtags: false,
  });

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleCheckboxChange = (event) => {
    setCheckboxes({
      ...checkboxes,
      [event.target.name]: event.target.checked,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    let modifiedInput = userInput;

    if (checkboxes.description) {
      modifiedInput = `Generate description of the image in the link (100 words): ${userInput}`;
    } else if (checkboxes.caption) {
      modifiedInput = `Suggest captions for the image in the link: ${userInput}`;
    } else if (checkboxes.hashtags) {
      modifiedInput = `Suggest hashtags for the image in the link: ${userInput}`;
    }

    setImageUrl(userInput);

    fetch('/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        text: modifiedInput,
        options: checkboxes
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setMessage(data.message);
        setChatHistory([...chatHistory, { prompt: modifiedInput, response: data.message }]);
        setUserInput(''); // Clear the input field
        //speak({ text: data.message, voice: voices[106] }); // Convert response to speech
      })
      .catch((error) => setError(error.message));
  };

  return (
    <div className="app-container">
      <div className="header-card">
        <h1>Imagic</h1>
      </div>
      <div className="intro-text">
        <p>
          Welcome to Imagic!<br />
          Enhance your social media presence with Imagic, the ultimate tool for generating captivating descriptions, engaging captions, and trending hashtags for your images. Powered by advanced AI technology, Imagic analyzes your photos and crafts personalized content that resonates with your audience, boosts engagement, and saves you time.
        </p>
      </div>
      <div className="split-container">
        {/* Left Section */}
        <div className="left-section">
          <form onSubmit={handleSubmit} className="form-container">
            <input
              type="text"
              value={userInput}
              onChange={handleInputChange}
              placeholder="Enter image link / Enter prompt"
              className="neobrutal-input"
            />
            <div className="group neobrutal-checkboxes">
              <label>
                <input
                  type="checkbox"
                  name="description"
                  checked={checkboxes.description}
                  onChange={handleCheckboxChange}
                />
                Description
              </label>
              <label>
                <input
                  type="checkbox"
                  name="caption"
                  checked={checkboxes.caption}
                  onChange={handleCheckboxChange}
                />
                Caption
              </label>
              <label>
                <input
                  type="checkbox"
                  name="hashtags"
                  checked={checkboxes.hashtags}
                  onChange={handleCheckboxChange}
                />
                Hashtags
              </label>
            </div>
            <button type="submit" className="neobrutal-button">Generate</button>
          </form>
          <div className="chat-history">
            {chatHistory.map((chat, index) => (
              <div key={index} className="chat-entry">
                {/* <p><strong>Prompt:</strong> {chat.prompt}</p> */}
                <p><strong></strong> {chat.response}</p>
                <hr />
              </div>
            ))}
          </div>
        </div>
        
        {/* Right Section */}
        <div className="right-section">
          {imageUrl && (
            <div className="card neobrutal-card">
              <h3>Image Preview</h3>
              <img src={imageUrl} alt="User provided link" className="card-image" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
