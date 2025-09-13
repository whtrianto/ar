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
          setStatusMessage('WebXR memerlukan HTTPS. Silakan gunakan HTTPS atau localhost untuk testing.');
          return;
        }

        if ('xr' in navigator) {
          const supported = await navigator.xr.isSessionSupported('immersive-ar');
          setIsWebXRSupported(supported);
          if (!supported) {
            setStatusMessage('WebXR AR tidak didukung di browser ini. Silakan gunakan Chrome mobile atau ARCore/ARKit compatible browser.');
          } else {
            setStatusMessage('WebXR AR didukung! Anda dapat menggunakan mode AR.');
          }
        } else {
          setStatusMessage('WebXR tidak didukung di browser ini. Silakan gunakan Chrome mobile atau ARCore/ARKit compatible browser.');
        }
      } catch (error) {
        // Log minimally without triggering ESLint "no-console" in CI/build
        setStatusMessage('WebXR tidak dapat diakses. Pastikan menggunakan HTTPS dan browser yang mendukung WebXR.');
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
      setStatusMessage('Pilih model 3D terlebih dahulu sebelum masuk ke mode AR');
      return;
    }
    setIsARMode(!isARMode);
    setStatusMessage('');
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <h1>Web AR Furniture</h1>
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
