import React, { useState, useEffect } from 'react';
import { ModelViewer } from './components/ModelViewer';
import { ARViewer } from './components/ARViewer';
import { ModelGallery } from './components/ModelGallery';
import './App.css';

function App() {
  const [selectedModel, setSelectedModel] = useState(null);
  const [isARMode, setIsARMode] = useState(false);
  const [isWebXRSupported, setIsWebXRSupported] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [placementMode, setPlacementMode] = useState('floor'); // 'floor' or 'wall'

  useEffect(() => {
    // Check WebXR support
    const checkWebXRSupport = async () => {
      try {
        const isSecureContext = window.isSecureContext || window.location.hostname === 'localhost';
        
        if (!isSecureContext) {
          setStatusMessage('WebXR requires HTTPS. Please use HTTPS or localhost for testing.');
          return;
        }

        if ('xr' in navigator) {
          const supported = await navigator.xr.isSessionSupported('immersive-ar');
          setIsWebXRSupported(supported);
          if (!supported) {
            setStatusMessage('WebXR AR not supported in this browser. Please use Chrome mobile or ARCore/ARKit compatible browser.');
          } else {
            setStatusMessage('WebXR AR supported! You can use AR mode.');
          }
        } else {
          setStatusMessage('WebXR not supported in this browser. Please use Chrome mobile or ARCore/ARKit compatible browser.');
        }
      } catch (error) {
        setStatusMessage('WebXR cannot be accessed. Please ensure you are using HTTPS and a WebXR compatible browser.');
      }
    };

    checkWebXRSupport();
  }, []);

  const handleModelSelect = (model) => {
    setSelectedModel(model);
    setStatusMessage('');
  };

  const handleARModeToggle = () => {
    if (!selectedModel) {
      setStatusMessage('Please select a 3D model first before entering AR mode');
      return;
    }
    setIsARMode(!isARMode);
    setStatusMessage('');
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <h1>Web AR Furniture1</h1>
          <p>Easily display interactive 3D models on the web & in AR</p>
          
          {statusMessage && (
            <div className="status-message">
              {statusMessage}
            </div>
          )}
        </div>
      </header>

      <main className="app-main">
        {!isARMode ? (
          <div className="viewer-container">
            <div className="viewer-section">
              <ModelViewer 
                selectedModel={selectedModel}
                onModelSelect={handleModelSelect}
              />
            </div>
            
            <div className="gallery-section">
              <ModelGallery 
                onModelSelect={handleModelSelect}
                selectedModel={selectedModel}
              />
            </div>
          </div>
        ) : (
          <ARViewer 
            selectedModel={selectedModel}
            placementMode={placementMode}
            onPlacementModeChange={setPlacementMode}
            onBack={() => setIsARMode(false)}
          />
        )}
      </main>

      <div className="ar-controls">
        {!isARMode && selectedModel && (
          <div className="ar-button-container">
            <button 
              className="ar-button"
              onClick={handleARModeToggle}
              disabled={!isWebXRSupported}
            >
              {isWebXRSupported ? 'View in AR' : 'AR Not Supported'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
