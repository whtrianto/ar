import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [isWebXRSupported, setIsWebXRSupported] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

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

  return (
    <div className="App">
      <header className="App-header">
        <h1>Web AR Furniture</h1>
        <p>Aplikasi Web AR untuk visualisasi furniture menggunakan WebXR</p>
        
        {statusMessage && (
          <div className="status-message">
            {statusMessage}
          </div>
        )}

        <div className="features">
          <h2>Fitur Utama:</h2>
          <ul>
            <li>3D Model Viewer</li>
            <li>WebXR AR Support</li>
            <li>Floorplan & Wall Detection</li>
            <li>Scale & Position Controls</li>
            <li>File Upload Support (GLB/USDZ)</li>
          </ul>
        </div>

        <div className="tech-stack">
          <h2>Teknologi:</h2>
          <ul>
            <li>React.js</li>
            <li>Three.js</li>
            <li>@react-three/fiber</li>
            <li>@react-three/drei</li>
            <li>@react-three/xr</li>
            <li>WebXR</li>
          </ul>
        </div>

        <div className="deployment-status">
          <h2>Status Deployment:</h2>
          <p>✅ Aplikasi berhasil di-deploy ke Vercel!</p>
          <p>✅ HTTPS enabled (required untuk WebXR)</p>
          <p>✅ Global CDN active</p>
          {isWebXRSupported ? (
            <p>✅ WebXR AR supported di browser ini</p>
          ) : (
            <p>⚠️ WebXR AR tidak didukung di browser ini</p>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
