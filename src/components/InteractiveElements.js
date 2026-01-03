import React, { useState } from "react";
import "./InteractiveElements.css";


const InteractiveElements = () => {
  const [progress, setProgress] = useState(50);
  const [clicked, setClicked] = useState(false);
  const [disabled, setDisabled] = useState(false);

  return (
    <div className="interactive-section">
      <h2>Interactive Elements</h2>

      {}
      <div className="button-group">
        <button
          data-testid="primary-button"
          className={`primary-btn ${clicked ? "active" : ""}`}
          onClick={() => setClicked(!clicked)}
        >
          {clicked ? "Clicked!" : "Click Me"}
        </button>

        <button
          data-testid="secondary-button"
          className="secondary-btn"
          onClick={() => alert("Secondary button pressed!")}
        >
          Secondary Action
        </button>

        <button
          data-testid="disabled-button"
          className="disabled-btn"
          disabled={disabled}
          onClick={() => setDisabled(true)}
        >
          {disabled ? "Disabled" : "Disable Me"}
        </button>
      </div>

      {}
      <div className="slider-container">
        <label htmlFor="progress">Adjust Progress: {progress}%</label>
        <input
          id="progress"
          data-testid="range"
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={(e) => setProgress(e.target.value)}
        />
        <progress
          data-testid="progress-bar"
          value={progress}
          max="100"
        ></progress>
      </div>
    </div>
  );
};

export default InteractiveElements;
