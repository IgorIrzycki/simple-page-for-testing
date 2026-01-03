import React, { useState, useEffect } from "react";
import "./FormElements.css";


const FormElements = () => {
  const [text, setText] = useState("");
  const [textarea, setTextarea] = useState("");
  const [select, setSelect] = useState("option1");
  const [checkbox, setCheckbox] = useState(false);
  const [radio, setRadio] = useState("A");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const body = document.body;
    if (darkMode) {
      body.classList.add("dark-mode");
    } else {
      body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  return (
    <div className="form-section">
      <h2>Form Elements</h2>

      <div className="form-row">
        <label htmlFor="text-input">Text Input:</label>
        <input
          id="text-input"
          data-testid="text-input"
          type="text"
          placeholder="Enter your name..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      <div className="form-row">
        <label htmlFor="textarea">Message Box:</label>
        <textarea
          id="textarea"
          data-testid="textarea"
          placeholder="Write a short message..."
          value={textarea}
          onChange={(e) => setTextarea(e.target.value)}
        ></textarea>
      </div>

      <div className="form-row">
        <label htmlFor="select">Select an Option:</label>
        <select
          id="select"
          data-testid="select"
          value={select}
          onChange={(e) => setSelect(e.target.value)}
        >
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
        </select>
      </div>

      {}
      <div className="checkbox-section">
        <h3>Agreement</h3>
        <label className="checkbox-item">
          <input
            data-testid="checkbox"
            type="checkbox"
            checked={checkbox}
            onChange={() => setCheckbox(!checkbox)}
          />
          <span>I agree to the terms and policies</span>
        </label>
      </div>

      {}
      <div className="radio-section">
        <h3>Preferences</h3>
        <div className="radio-group">
          <label className="radio-item">
            <input
              data-testid="radio-A"
              type="radio"
              name="radio"
              value="A"
              checked={radio === "A"}
              onChange={() => setRadio("A")}
            />
            <span>Receive weekly updates</span>
          </label>

          <label className="radio-item">
            <input
              data-testid="radio-B"
              type="radio"
              name="radio"
              value="B"
              checked={radio === "B"}
              onChange={() => setRadio("B")}
            />
            <span>Receive monthly updates</span>
          </label>
        </div>
      </div>

      {}
      <div className="dark-mode-container">
        <h3>Appearance</h3>
        <div
          className={`toggle ${darkMode ? "on" : "off"}`}
          data-testid="dark-mode-toggle"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "Dark" : "Light"}
        </div>
      </div>
    </div>
  );
};

export default FormElements;
