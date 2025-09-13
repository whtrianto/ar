import React, { useState, useEffect } from 'react';
import { ModelViewer } from './components/ModelViewer';
import { ModelGallery } from './components/ModelGallery';
import './App.css';

function App() {
  const [selectedModel, setSelectedModel] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    // Disable AR mode untuk Hostinger
    setStatusMessage('3D Model Viewer - AR mode tidak tersedia di shared hosting');
  }, []);

  const handleModelSelect = (model) => {
    setSelectedModel(model);
    setStatusMessage('');
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <h1>Web AR Furniture</h1>
          <p>3D Model Viewer - Interactive 3D models on the web</p>
          
          {statusMessage && (
            <div className="status-message">
              {statusMessage}
            </div>
          )}
        </div>
      </header>

      <main className="app-main">
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
      </main>

      <div className="hostinger-info">
        <div className="info-card">
          <h3>3D Model Viewer</h3>
          <p>Interactive 3D models dengan Three.js</p>
          <ul>
            <li>✅ Mouse/Touch controls</li>
            <li>✅ Model gallery</li>
            <li>✅ Search & filter</li>
            <li>✅ Responsive design</li>
            <li>❌ AR mode (tidak tersedia di shared hosting)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
