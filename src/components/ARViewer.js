import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, useGLTF } from '@react-three/drei';
import { ARCanvas, XRButton, DefaultXRControllers, Hands, useXR } from '@react-three/xr';
import { ARPlacement } from './ARPlacement';

function ARModel({ url, position, rotation, scale, isARActive }) {
  const { scene } = useGLTF(url);
  const meshRef = useRef();
  
  return (
    <primitive 
      ref={meshRef}
      object={scene} 
      position={position} 
      rotation={rotation} 
      scale={scale}
    />
  );
}

function ARSessionManager({ onSessionStart, onSessionEnd, isARActive }) {
  const { isPresenting, isLocal } = useXR();
  
  useEffect(() => {
    if (isPresenting && isLocal) {
      onSessionStart();
    } else if (!isPresenting && isARActive) {
      onSessionEnd();
    }
  }, [isPresenting, isLocal, isARActive, onSessionStart, onSessionEnd]);
  
  return null;
}

function ARViewer({ selectedModel, placementMode, onPlacementModeChange, onBack }) {
  const [isARActive, setIsARActive] = useState(false);
  const [placementInstructions, setPlacementInstructions] = useState('');
  const [modelPosition, setModelPosition] = useState([0, 0, -2]);
  const [isDesktop, setIsDesktop] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isARSupported, setIsARSupported] = useState(false);
  const [arStatusMessage, setArStatusMessage] = useState('');
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [arError, setArError] = useState(null);
  const [isModelPlaced, setIsModelPlaced] = useState(false);

  useEffect(() => {
    // Check if desktop
    const isDesktopDevice = !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setIsDesktop(isDesktopDevice);
    
    if (placementMode === 'floor') {
      setPlacementInstructions(isDesktopDevice ? 'Desktop: Use mouse to interact with model' : 'Tap on the floor to place the model');
      setModelPosition([0, -1, -2]);
    } else if (placementMode === 'wall') {
      setPlacementInstructions(isDesktopDevice ? 'Desktop: Use mouse to interact with model' : 'Point at a wall and tap to place the model');
      setModelPosition([0, 0, -1]);
    }
  }, [placementMode]);

  useEffect(() => {
    // Detect WebXR support for AR and camera permission
    const checkXR = async () => {
      try {
        // Check if we're in a secure context
        if (!window.isSecureContext && window.location.hostname !== 'localhost') {
          setIsARSupported(false);
          setArStatusMessage('AR requires HTTPS. Please use HTTPS or localhost for testing.');
          return;
        }

        // Check WebXR support
        if (navigator.xr && navigator.xr.isSessionSupported) {
          const supported = await navigator.xr.isSessionSupported('immersive-ar');
          setIsARSupported(supported);
          
          if (supported) {
            setArStatusMessage('WebXR AR supported! Ready to start AR experience.');
            
            // Check camera permission
            try {
              const stream = await navigator.mediaDevices.getUserMedia({ video: true });
              setCameraPermission(true);
              stream.getTracks().forEach(track => track.stop()); // Stop the stream immediately
            } catch (cameraErr) {
              setCameraPermission(false);
              setArStatusMessage('Camera access required for AR. Please allow camera permission.');
            }
          } else {
            setArStatusMessage('WebXR AR not supported on this device. Please use a compatible mobile device.');
          }
        } else {
          setIsARSupported(false);
          setArStatusMessage('WebXR not available in this browser. Please use Chrome mobile or ARCore/ARKit compatible browser.');
        }
      } catch (err) {
        setIsARSupported(false);
        setArStatusMessage('Error detecting WebXR: ' + (err.message || err));
        setArError(err.message || 'Unknown error');
      }
    };

    checkXR();
  }, []);

  // Diagnostics for debugging blank AR on mobile
  const diagnostics = {
    navigatorXR: !!(navigator && navigator.xr),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    protocol: typeof window !== 'undefined' ? window.location.protocol : 'unknown',
    isARSupported: isARSupported,
    arStatusMessage: arStatusMessage,
    cameraPermission: cameraPermission,
    isSecureContext: window.isSecureContext
  };

  const handleSessionStart = () => {
    setIsSessionActive(true);
    setArError(null);
    setIsModelPlaced(false); // Reset placement when starting new session
    // eslint-disable-next-line no-console
    console.log('AR Session started');
  };

  const handleSessionEnd = () => {
    setIsSessionActive(false);
    setIsARActive(false);
    setIsModelPlaced(false);
    setArError(null);
    // eslint-disable-next-line no-console
    console.log('AR Session ended');
  };

  const startAR = async () => {
    if (!selectedModel) {
      setArError('Please select a model first');
      return;
    }
    
    try {
      setArError(null);
      
      // Check WebXR support
      if (!isARSupported) {
        setArError('WebXR AR is not supported on this device. Please use a compatible mobile device with Chrome or ARCore/ARKit support.');
        return;
      }
      
      // Check camera permission again before starting AR
      if (cameraPermission === false) {
        setArError('Camera access is required for AR. Please allow camera permission and try again.');
        return;
      }
      
      // Check secure context
      if (!window.isSecureContext && window.location.hostname !== 'localhost') {
        setArError('AR requires HTTPS. Please use HTTPS or localhost for testing.');
        return;
      }
      
      // eslint-disable-next-line no-console
      console.debug('Start AR clicked', diagnostics);
      setIsARActive(true);
    } catch (error) {
      setArError('Failed to start AR: ' + error.message);
      // eslint-disable-next-line no-console
      console.error('AR start error:', error);
    }
  };

  const stopAR = () => {
    setIsARActive(false);
    setIsSessionActive(false);
    setIsModelPlaced(false);
    setArError(null);
    // eslint-disable-next-line no-console
    console.log('AR stopped by user');
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isARActive) {
        stopAR();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePlacementModeChange = (mode) => {
    onPlacementModeChange(mode);
    setIsModelPlaced(false); // Reset placement when changing mode
  };

  const handleModelPlaced = (position, normal) => {
    setModelPosition(position);
    setIsModelPlaced(true);
    // eslint-disable-next-line no-console
    console.log('Model placed at:', position, 'with normal:', normal);
  };

  return (
    <div className="ar-viewer-container">
      <div className="ar-header">
        <button className="back-button" onClick={onBack}>
          ← Back to Viewer
        </button>
        <h2>AR Mode</h2>
        <div className="placement-mode-selector">
          <button 
            className={`mode-button ${placementMode === 'floor' ? 'active' : ''}`}
            onClick={() => handlePlacementModeChange('floor')}
          >
            Floor
          </button>
          <button 
            className={`mode-button ${placementMode === 'wall' ? 'active' : ''}`}
            onClick={() => handlePlacementModeChange('wall')}
          >
            Wall
          </button>
        </div>
      </div>

      <div className="ar-content">
        {selectedModel ? (
          <div className="ar-model-container">
            {isARActive ? (
              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <ARCanvas
                  camera={{ position: [0, 0, 5], fov: 50 }}
                  style={{ width: '100%', height: '100%', backgroundColor: '#000' }}
                  onSessionStart={handleSessionStart}
                  onSessionEnd={handleSessionEnd}
                >
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <Environment preset="studio" />
                <ContactShadows 
                  position={[0, -1, 0]} 
                  opacity={0.25} 
                  scale={10} 
                  blur={1.5} 
                  far={4} 
                />
                <ARModel 
                  url={selectedModel.url}
                  position={modelPosition}
                  rotation={[0, 0, 0]}
                  scale={[1, 1, 1]}
                  isARActive={isARActive}
                />
                <ARPlacement
                  selectedModel={selectedModel}
                  placementMode={placementMode}
                  onModelPlaced={handleModelPlaced}
                  modelPosition={modelPosition}
                  setModelPosition={setModelPosition}
                />
                <DefaultXRControllers />
                <Hands />
                <ARSessionManager 
                  onSessionStart={handleSessionStart}
                  onSessionEnd={handleSessionEnd}
                  isARActive={isARActive}
                />
                </ARCanvas>
                <div style={{ 
                  position: 'absolute', 
                  top: '20px', 
                  left: '20px', 
                  zIndex: 1000 
                }}>
                  <XRButton
                    mode="AR"
                    sessionInit={{
                      requiredFeatures: ['local-floor'],
                      optionalFeatures: ['bounded-floor', 'hand-tracking']
                    }}
                    style={{
                      background: '#667eea',
                      color: 'white',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: '600'
                    }}
                  >
                    Enter AR
                  </XRButton>
                </div>
              </div>
            ) : showPreview && isDesktop ? (
              <Canvas
                camera={{ position: [0, 0, 5], fov: 50 }}
                style={{ width: '100%', height: '100%', backgroundColor: '#000' }}
              >
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <Environment preset="studio" />
                <ContactShadows 
                  position={[0, -1, 0]} 
                  opacity={0.25} 
                  scale={10} 
                  blur={1.5} 
                  far={4} 
                />
                <ARModel 
                  url={selectedModel.url}
                  position={modelPosition}
                  rotation={[0, 0, 0]}
                  scale={[1, 1, 1]}
                />
                <OrbitControls 
                  enablePan={true}
                  enableZoom={true}
                  enableRotate={true}
                  minDistance={2}
                  maxDistance={10}
                />
              </Canvas>
            ) : (
              <div style={{ 
                width: '100%', 
                height: '100%', 
                backgroundColor: '#000', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'white',
                fontSize: '18px'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <h3>AR Ready</h3>
                  <p>Click "Start AR Experience" to begin</p>
                  <div style={{ marginTop: '20px', fontSize: '14px', color: '#ccc' }}>
                    <p>Debug Info:</p>
                    <p>isARActive: {String(isARActive)}</p>
                    <p>isDesktop: {String(isDesktop)}</p>
                    <p>showPreview: {String(showPreview)}</p>
                    <p>isARSupported: {String(isARSupported)}</p>
                    <p>cameraPermission: {String(cameraPermission)}</p>
                  </div>
                </div>
              </div>
            )}

            {!isARActive && !showPreview && selectedModel && (
              <div className="ar-start-overlay">
                <div className="ar-start-content">
                  <h3>Ready for AR</h3>
                  <p>Placement Mode: <strong>{placementMode}</strong></p>
                  <p className="instructions">{placementInstructions}</p>

                  {arError && (
                    <div style={{ 
                      marginTop: 12, 
                      padding: 12, 
                      background: 'rgba(220, 53, 69, 0.2)', 
                      border: '1px solid rgba(220, 53, 69, 0.5)',
                      borderRadius: 8,
                      color: '#ff6b6b'
                    }}>
                      <strong>Error:</strong> {arError}
                    </div>
                  )}

                  <div style={{ 
                    marginTop: 12, 
                    textAlign: 'left', 
                    background: 'rgba(255,255,255,0.06)', 
                    padding: 8, 
                    borderRadius: 8 
                  }}>
                    <strong>Status</strong>
                    <div style={{ fontSize: 12, color: '#fff', marginTop: 6 }}>
                      <div>WebXR Support: {String(diagnostics.isARSupported)}</div>
                      <div>Camera Permission: {cameraPermission === null ? 'Checking...' : String(cameraPermission)}</div>
                      <div>Secure Context: {String(diagnostics.isSecureContext)}</div>
                      <div>Protocol: {diagnostics.protocol}</div>
                      <div style={{ wordBreak: 'break-word', fontSize: 10, marginTop: 4 }}>
                        {diagnostics.arStatusMessage}
                      </div>
                    </div>
                  </div>
                  
                  {isDesktop ? (
                    <div className="desktop-ar-options">
                      <button
                        className="preview-button"
                        onClick={() => setShowPreview(true)}
                      >
                        Preview AR (Desktop)
                      </button>
                      <XRButton
                        className="start-ar-button"
                        onClick={startAR}
                        disabled={!isARSupported}
                      >
                        Try WebXR (Experimental)
                      </XRButton>
                      <p className="desktop-note">
                        Note: Real AR requires mobile device with ARCore/ARKit
                      </p>
                    </div>
                  ) : (
                    <div>
                      <button
                        className="start-ar-button"
                        onClick={startAR}
                        disabled={!isARSupported || cameraPermission === false}
                      >
                        {cameraPermission === false ? 'Camera Permission Required' : 'Start AR Experience'}
                      </button>
                      {!isARSupported && (
                        <div className="status-message" style={{ marginTop: '8px' }}>{arStatusMessage}</div>
                      )}
                      {cameraPermission === false && (
                        <div className="status-message" style={{ marginTop: '8px', color: '#ff6b6b' }}>
                          Please allow camera access to use AR features
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {showPreview && isDesktop && (
              <div className="ar-preview-overlay">
                <div className="ar-preview-content">
                  <h3>AR Preview Mode</h3>
                  <p>Use mouse to interact with the model</p>
                  <div className="preview-controls">
                    <button
                      className="back-to-ar-button"
                      onClick={() => setShowPreview(false)}
                    >
                      Back to AR Options
                    </button>
                    <XRButton
                      className="start-ar-button"
                      onClick={startAR}
                    >
                      Try Real AR
                    </XRButton>
                  </div>
                </div>
              </div>
            )}

            {isARActive && (
              <div className="ar-controls-overlay">
                <button className="stop-ar-button" onClick={stopAR}>
                  Stop AR
                </button>
                <div className="ar-instructions">
                  <p>{placementInstructions}</p>
                  {isSessionActive && (
                    <p style={{ color: '#4CAF50', fontWeight: 'bold' }}>
                      AR Session Active - Camera is running
                    </p>
                  )}
                  {isModelPlaced && (
                    <p style={{ color: '#2196F3', fontWeight: 'bold' }}>
                      Model placed successfully! You can move around to view it.
                    </p>
                  )}
                  {!isModelPlaced && isSessionActive && (
                    <div style={{ 
                      background: 'rgba(0, 0, 0, 0.8)', 
                      padding: '15px', 
                      borderRadius: '8px', 
                      marginTop: '10px',
                      textAlign: 'center'
                    }}>
                      <h4 style={{ margin: '0 0 10px 0', color: '#667eea' }}>AR Placement</h4>
                      <p style={{ margin: '5px 0', fontSize: '14px' }}>
                        {placementMode === 'floor' 
                          ? 'Point your device at the floor and tap to place the model'
                          : 'Point your device at a wall and tap to place the model'
                        }
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="no-model-ar">
            <h3>No Model Selected</h3>
            <p>Please select a model first</p>
          </div>
        )}
      </div>

      <div className="ar-info-panel">
        <div className="model-info">
          <h4>{selectedModel?.name || 'No Model'}</h4>
          <p>{selectedModel?.description || 'Select a model to view in AR'}</p>
          <div className="placement-info">
            <span className="placement-badge">
              {placementMode === 'floor' ? '🏠 Floor Placement' : '🧱 Wall Placement'}
            </span>
          </div>
        </div>
        
        <div className="ar-tips">
          <h4>AR Tips:</h4>
          <ul>
            <li>Ensure good lighting</li>
            <li>Keep device steady</li>
            <li>Move slowly for better tracking</li>
            <li>Tap to place the model</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export { ARViewer };
