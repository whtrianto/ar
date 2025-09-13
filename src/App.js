import React, { useState, useEffect } from 'react';
import { ModelViewer } from './components/ModelViewer';
import { ModelViewerAR } from './components/ModelViewerAR';
import { WallDetectionAR } from './components/WallDetectionAR';
import { AdvancedAR } from './components/AdvancedAR';
import { SimpleAR } from './components/SimpleAR';
import { ControlsPanel } from './components/ControlsPanel';
import './App.css';

function App() {
  const [isARMode, setIsARMode] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);
  const [modelScale, setModelScale] = useState(1);
  const [modelPosition, setModelPosition] = useState({ x: 0, y: 0, z: 0 });
  const [modelRotation, setModelRotation] = useState({ x: 0, y: 0, z: 0 });
  const [isWebXRSupported, setIsWebXRSupported] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [arMode, setArMode] = useState('model-viewer'); // 'model-viewer', 'wall-detection', 'advanced'

  useEffect(() => {
    // Check WebXR support
    const checkWebXRSupport = async () => {
      try {
        // Check if we're on HTTPS or localhost
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
        console.error('WebXR check error:', error);
        setStatusMessage('WebXR tidak dapat diakses. Pastikan menggunakan HTTPS dan browser yang mendukung WebXR.');
      }
    };

    checkWebXRSupport();
  }, []);

  const handleModelSelect = (model) => {
    setSelectedModel(model);
    setStatusMessage('');
  };

  const handleScaleChange = (scale) => {
    setModelScale(scale);
  };

  const handlePositionChange = (position) => {
    setModelPosition(position);
  };

  const handleRotationChange = (rotation) => {
    setModelRotation(rotation);
  };

  const handleARModeToggle = () => {
    if (!selectedModel) {
      setStatusMessage('Pilih model 3D terlebih dahulu sebelum masuk ke mode AR');
      return;
    }
    setIsARMode(!isARMode);
    setStatusMessage('');
  };

  const handleResetModel = () => {
    setModelScale(1);
    setModelPosition({ x: 0, y: 0, z: 0 });
    setModelRotation({ x: 0, y: 0, z: 0 });
  };

  return (
    <div className="App">
      {statusMessage && (
        <div className="status-message">
          {statusMessage}
        </div>
      )}

      {!isARMode ? (
        <div className="model-viewer-container">
          <ModelViewer
            selectedModel={selectedModel}
            scale={modelScale}
            position={modelPosition}
            rotation={modelRotation}
            onScaleChange={handleScaleChange}
            onPositionChange={handlePositionChange}
            onRotationChange={handleRotationChange}
          />
        </div>
      ) : (
        <div className="ar-container">
          {arMode === 'model-viewer' && (
            <ModelViewerAR
              selectedModel={selectedModel}
              scale={modelScale}
              position={modelPosition}
              rotation={modelRotation}
              onPlacement={(placement) => {
                console.log('Model placed:', placement);
              }}
            />
          )}
          
          {arMode === 'wall-detection' && (
            <WallDetectionAR
              selectedModel={selectedModel}
              scale={modelScale}
              position={modelPosition}
              rotation={modelRotation}
              onPlacement={(placement) => {
                console.log('Model placed:', placement);
              }}
            />
          )}
          
          {arMode === 'advanced' && (
            <AdvancedAR
              selectedModel={selectedModel}
              scale={modelScale}
              position={modelPosition}
              rotation={modelRotation}
              onPlacement={(placement) => {
                console.log('Model placed:', placement);
              }}
            />
          )}
          
          {arMode === 'simple' && (
            <SimpleAR
              selectedModel={selectedModel}
              scale={modelScale}
              position={modelPosition}
              rotation={modelRotation}
              onPlacement={(placement) => {
                console.log('Model placed:', placement);
              }}
            />
          )}
        </div>
      )}

      <ControlsPanel
        selectedModel={selectedModel}
        onModelSelect={handleModelSelect}
        scale={modelScale}
        position={modelPosition}
        rotation={modelRotation}
        onScaleChange={handleScaleChange}
        onPositionChange={handlePositionChange}
        onRotationChange={handleRotationChange}
        onResetModel={handleResetModel}
        isARMode={isARMode}
        onARModeToggle={handleARModeToggle}
        isWebXRSupported={isWebXRSupported}
        arMode={arMode}
        onArModeChange={setArMode}
      />

      {!isARMode && (
        <button
          className="ar-button"
          onClick={handleARModeToggle}
          disabled={!selectedModel || !isWebXRSupported}
        >
          {isWebXRSupported ? 'Masuk ke Mode AR' : 'WebXR Tidak Didukung'}
        </button>
      )}
    </div>
  );
}

export default App;
