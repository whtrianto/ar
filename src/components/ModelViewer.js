import React, { useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, useGLTF } from '@react-three/drei';

// Sample models moved to ModelGallery component

function Model({ url, position, rotation, scale }) {
  const { scene } = useGLTF(url);
  
  useFrame(() => {
    if (scene) {
      scene.rotation.y += 0.005;
    }
  });

  return (
    <primitive 
      object={scene} 
      position={position} 
      rotation={rotation} 
      scale={scale}
    />
  );
}

function ModelViewer({ selectedModel, onModelSelect }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modelInfo, setModelInfo] = useState(null);

  useEffect(() => {
    if (selectedModel) {
      setIsLoading(true);
      setError(null);
      setModelInfo({
        name: selectedModel.name,
        description: selectedModel.description,
        category: selectedModel.category
      });
      setIsLoading(false);
    }
  }, [selectedModel]);

  const handleModelUpload = (event) => {
    const file = event.target.files[0];
    if (file && (file.name.endsWith('.glb') || file.name.endsWith('.gltf'))) {
      const url = URL.createObjectURL(file);
      const newModel = {
        id: 'uploaded-' + Date.now(),
        name: file.name.replace(/\.(glb|gltf)$/, ''),
        url: url,
        description: 'Uploaded model',
        category: 'custom',
        arPlacement: 'floor'
      };
      onModelSelect(newModel);
    }
  };

  return (
    <div className="model-viewer-container">
      <div className="model-viewer-header">
        <h2>3D Model Viewer</h2>
        <div className="model-controls">
          <input
            type="file"
            accept=".glb,.gltf"
            onChange={handleModelUpload}
            className="file-input"
            id="model-upload"
          />
          <label htmlFor="model-upload" className="upload-button">
            Upload Model
          </label>
        </div>
      </div>

      <div className="model-viewer-content">
        {selectedModel ? (
          <div className="model-container">
            <Canvas
              camera={{ position: [0, 0, 5], fov: 50 }}
              style={{ width: '100%', height: '500px', backgroundColor: '#f0f0f0' }}
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
              <Model 
                url={selectedModel.url}
                position={[0, 0, 0]}
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

            {isLoading && (
              <div className="loading-overlay">
                <div className="loading-spinner"></div>
                <p>Loading model...</p>
              </div>
            )}

            {error && (
              <div className="error-message">
                <p>Error: {error}</p>
              </div>
            )}

            {modelInfo && (
              <div className="model-info">
                <h3>{modelInfo.name}</h3>
                <p>{modelInfo.description}</p>
                <div className="model-tags">
                  <span className="tag">{modelInfo.category}</span>
                  <span className="tag">{selectedModel.arPlacement}</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="no-model-placeholder">
            <div className="placeholder-content">
              <h3>Select a 3D Model</h3>
              <p>Choose a model from the gallery below or upload your own</p>
              <div className="placeholder-features">
                <div className="feature">
                  <span className="icon">🎯</span>
                  <span>AR Placement</span>
                </div>
                <div className="feature">
                  <span className="icon">📱</span>
                  <span>Mobile Ready</span>
                </div>
                <div className="feature">
                  <span className="icon">🔄</span>
                  <span>Interactive</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export { ModelViewer };