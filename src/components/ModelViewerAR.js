import React, { useRef, useEffect, useState } from 'react';

function ModelViewerAR({ selectedModel, scale, position, rotation, onPlacement }) {
  const modelViewerRef = useRef();
  const [isARSupported, setIsARSupported] = useState(false);
  const [placementMode, setPlacementMode] = useState('floor'); // 'floor' or 'wall'
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent || '';
    setIsIOS(/iPhone|iPad|iPod/.test(ua));
  }, []);

  useEffect(() => {
    // Check AR support
    if (modelViewerRef.current) {
      modelViewerRef.current.addEventListener('ar-status', (event) => {
        setIsARSupported(event.detail.status === 'session-started');
      });
    }
  }, []);

  const handleModelLoad = () => {
    console.log('Model loaded successfully');
  };

  const handleModelError = (error) => {
    console.error('Model loading error:', error);
  };

  const handleARPlacement = (event) => {
    if (event.detail.placement) {
      // Model placed
      onPlacement && onPlacement(event.detail.placement);
    }
  };

  const togglePlacementMode = () => {
    setPlacementMode(placementMode === 'floor' ? 'wall' : 'floor');
  };

  if (!selectedModel) {
    return (
      <div className="model-viewer-ar-container">
        <div className="no-model-message">
          <h3>Pilih Model 3D</h3>
          <p>Gunakan panel kontrol untuk memilih atau upload model furniture</p>
        </div>
      </div>
    );
  }

  return (
    <div className="model-viewer-ar-container">
      <model-viewer
        ref={modelViewerRef}
        src={selectedModel.url}
        alt={selectedModel.name}
        ar
        ar-modes="webxr scene-viewer quick-look"
        ar-scale="auto"
        ar-placement={placementMode}
        camera-controls
        auto-rotate
        shadow-intensity="1"
        shadow-softness="0.5"
        environment-image="neutral"
        skybox-image="neutral"
        tone-mapping="neutral"
        exposure="1"
        onload={handleModelLoad}
        onerror={handleModelError}
        onar-status={handleARPlacement}
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#f0f0f0'
        }}
      >
        <div className="ar-controls">
          <button 
            className="placement-mode-btn"
            onClick={togglePlacementMode}
          >
            {placementMode === 'floor' ? '🎯 Floor Mode' : '🧱 Wall Mode'}
          </button>
          
          {isARSupported && (
            <div className="ar-instructions">
              <p>
                {placementMode === 'floor' 
                  ? '📱 Gerakkan kamera dan tap di lantai untuk menempatkan model'
                  : '📱 Gerakkan kamera dan tap di dinding untuk menempatkan model'
                }
              </p>
            </div>
          )}
        </div>
      </model-viewer>

      {!isARSupported && (
        <div className="ar-not-supported">
          <h3>AR Tidak Didukung</h3>
          <p>Gunakan browser yang mendukung WebXR atau ARCore/ARKit</p>
          <ul>
            <li>Chrome Mobile (Android) dengan ARCore</li>
            <li>Safari (iOS) dengan ARKit</li>
            <li>Chrome Desktop dengan WebXR flags</li>
          </ul>
          {isIOS && selectedModel && !selectedModel.url.endsWith('.usdz') && (
            <div style={{ marginTop: 12 }}>
              <strong>iOS detected:</strong>
              <p>Untuk AR di iOS, file .usdz direkomendasikan. Anda dapat menyediakan versi .usdz atau gunakan Quick Look dengan file .usdz.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export { ModelViewerAR };
