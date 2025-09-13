import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, useGLTF } from '@react-three/drei';
import { ARCanvas, XRButton, DefaultXRControllers, Hands } from '@react-three/xr';

function ARModel({ url, position, rotation, scale }) {
  const { scene } = useGLTF(url);
  
  return (
    <primitive 
      object={scene} 
      position={position} 
      rotation={rotation} 
      scale={scale}
    />
  );
}

function ARViewer({ selectedModel, placementMode, onPlacementModeChange, onBack }) {
  const [isARActive, setIsARActive] = useState(false);
  const [placementInstructions, setPlacementInstructions] = useState('');
  const [modelPosition, setModelPosition] = useState([0, 0, -2]);
  const [isDesktop, setIsDesktop] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isARSupported, setIsARSupported] = useState(false);
  const [arStatusMessage, setArStatusMessage] = useState('');

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
    // Detect WebXR support for AR
    const checkXR = async () => {
      try {
        if (navigator.xr && navigator.xr.isSessionSupported) {
          const supported = await navigator.xr.isSessionSupported('immersive-ar');
          setIsARSupported(supported);
          setArStatusMessage(supported ? 'WebXR AR supported' : 'WebXR AR not supported');
        } else {
          setIsARSupported(false);
          setArStatusMessage('WebXR not available in this browser');
        }
      } catch (err) {
        setIsARSupported(false);
        setArStatusMessage('Error detecting WebXR: ' + (err.message || err));
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
    arStatusMessage: arStatusMessage
  };

  const startAR = async () => {
    if (!selectedModel) return;
  // eslint-disable-next-line no-console
  console.debug('Start AR clicked', diagnostics);
    setIsARActive(true);
  };

  const stopAR = () => {
    setIsARActive(false);
  };

  const handlePlacementModeChange = (mode) => {
    onPlacementModeChange(mode);
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
            {showPreview && isDesktop ? (
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
              <ARCanvas
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
                <DefaultXRControllers />
                <Hands />
              </ARCanvas>
            )}

            {!isARActive && !showPreview && (
              <div className="ar-start-overlay">
                <div className="ar-start-content">
                  <h3>Ready for AR</h3>
                  <p>Placement Mode: <strong>{placementMode}</strong></p>
                  <p className="instructions">{placementInstructions}</p>

                      <div style={{ marginTop: 12, textAlign: 'left', background: 'rgba(255,255,255,0.06)', padding: 8, borderRadius: 8 }}>
                        <strong>Diagnostics</strong>
                        <div style={{ fontSize: 12, color: '#fff', marginTop: 6 }}>
                          <div>navigator.xr: {String(diagnostics.navigatorXR)}</div>
                          <div>isARSupported: {String(diagnostics.isARSupported)}</div>
                          <div>protocol: {diagnostics.protocol}</div>
                          <div style={{ wordBreak: 'break-word' }}>UA: {diagnostics.userAgent}</div>
                          <div>Status: {diagnostics.arStatusMessage}</div>
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
                      <XRButton
                        className="start-ar-button"
                        onClick={startAR}
                        disabled={!isARSupported}
                      >
                        Start AR Experience
                      </XRButton>
                      {!isARSupported && (
                        <div className="status-message" style={{ marginTop: '8px' }}>{arStatusMessage}</div>
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
