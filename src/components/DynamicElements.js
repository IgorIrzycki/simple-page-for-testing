import React, { useState } from "react";
import "./DynamicElements.css";

const DynamicElements = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [showLoader, setShowLoader] = useState(false);

  const handleAlert = () => {
    setAlertText("Your action was successfully completed!");
    setTimeout(() => setAlertText(""), 3000);
  };

  const handleLoader = () => {
    setShowLoader(true);
    setTimeout(() => setShowLoader(false), 2000);
  };

  return (
    <div className="dynamic-section">
      <h2>Dynamic & Visual Elements</h2>

      <div className="elements-wrapper">
        <div className="element">
          <button data-testid="modal-btn" onClick={() => setModalOpen(true)}>
            Open Information Modal
          </button>
        </div>

        {modalOpen && (
          <div className="modal" data-testid="modal">
            <div className="modal-content">
              <h3>Information</h3>
              <p>This is a sample modal window used for testing visibility and closing actions.</p>
              <button onClick={() => setModalOpen(false)}>Close</button>
            </div>
          </div>
        )}

        <div className="element">
          <div
            className="tooltip"
            data-testid="tooltip"
            title="This tooltip appears when hovered."
          >
            Hover here to see tooltip
          </div>
        </div>

        <div className="element">
          <button data-testid="alert-btn" onClick={handleAlert}>
            Show Alert Message
          </button>

          {alertText && (
            <div className="alert" data-testid="alert">
              {alertText}
            </div>
          )}
        </div>

        <div className="element">
          <button data-testid="loader-btn" onClick={handleLoader}>
            Simulate Loading
          </button>

          {showLoader && <div className="loader" data-testid="loader"></div>}
        </div>
      </div>
    </div>
  );
};

export default DynamicElements;
