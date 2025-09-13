import React, { useEffect, useState } from 'react';

function SimpleAR({ selectedModel, scale, position, rotation, onPlacement }) {
  const [isARSupported, setIsARSupported] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    checkARSupport();
  }, []);

  const checkARSupport = async () => {
    try {
      if (!navigator.xr) {
        setStatusMessage('WebXR tidak didukung di browser ini');
        return;
      }

      const supported = await navigator.xr.isSessionSupported('immersive-ar');
      if (supported) {
        setIsARSupported(true);
        setStatusMessage('AR didukung! Klik tombol untuk memulai AR');
      } else {
        setStatusMessage('AR tidak didukung di browser ini');
      }
    } catch (error) {
      console.error('AR support check error:', error);
      setStatusMessage('Error checking AR support');
    }
  };

  const startAR = async () => {
    try {
      if (!navigator.xr) {
        setStatusMessage('WebXR tidak didukung');
        return;
      }

      await navigator.xr.requestSession('immersive-ar', {
        requiredFeatures: ['local', 'hit-test']
      });

      setStatusMessage('AR session dimulai! Gerakkan kamera untuk melihat model');
      
      // Simulate model placement
      setTimeout(() => {
        onPlacement && onPlacement({
          position: { x: 0, y: 0, z: -1 },
          rotation: { x: 0, y: 0, z: 0 }
        });
        setStatusMessage('Model ditempatkan di AR!');
      }, 2000);

    } catch (error) {
      console.error('AR session error:', error);
      setStatusMessage('Gagal memulai AR session: ' + error.message);
    }
  };

  if (!selectedModel) {
    return (
      <div className="simple-ar-container">
        <div className="no-model-message">
          <h3>Pilih Model 3D</h3>
          <p>Gunakan panel kontrol untuk memilih model terlebih dahulu</p>
        </div>
      </div>
    );
  }

  return (
    <div className="simple-ar-container">
      <div className="ar-content">
        <h2>Simple AR Mode</h2>
        <p>Model: {selectedModel.name}</p>
        <p>Scale: {scale}x</p>
        <p>Position: ({position.x}, {position.y}, {position.z})</p>
        <p>Rotation: ({rotation.x}°, {rotation.y}°, {rotation.z}°)</p>
        
        <div className="ar-controls">
          <button 
            className="ar-start-btn"
            onClick={startAR}
            disabled={!isARSupported}
          >
            {isARSupported ? '🚀 Start AR' : 'AR Tidak Didukung'}
          </button>
        </div>

        <div className="status-message">
          {statusMessage}
        </div>

        <div className="ar-instructions">
          <h3>Instruksi AR:</h3>
          <ul>
            <li>Pastikan browser mendukung WebXR</li>
            <li>Gunakan HTTPS untuk AR</li>
            <li>Gerakkan kamera untuk scan area</li>
            <li>Model akan muncul di AR setelah 2 detik</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export { SimpleAR };
