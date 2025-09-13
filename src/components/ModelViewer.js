import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { modelLoader } from '../utils/modelLoader';

function ModelViewer({ selectedModel, scale, position, rotation, onScaleChange, onPositionChange, onRotationChange }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modelInfo, setModelInfo] = useState(null);

  const handleModelLoad = useCallback((info) => {
    setIsLoading(false);
    setError(null);
    setModelInfo(info);
  }, []);

  const handleModelError = useCallback((err) => {
    setIsLoading(false);
    setError('Gagal memuat model 3D. Pastikan file format GLB atau USDZ valid.');
    console.error('Model loading error:', err);
  }, []);

  const handleLoadingStart = useCallback(() => {
    setIsLoading(true);
  }, []);

  return (
    <div className="model-viewer-container">
      <Canvas
        camera={{ position: [0, 1.6, 3], fov: 75 }}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
        style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <Environment preset="studio" />
        
        {selectedModel ? (
          <Model3D
            model={selectedModel}
            scale={scale}
            position={position}
            rotation={rotation}
            onLoad={handleModelLoad}
            onError={handleModelError}
            onLoadingStart={handleLoadingStart}
          />
        ) : (
          <PlaceholderModel />
        )}
        
        <ContactShadows
          position={[0, -0.5, 0]}
          opacity={0.25}
          scale={10}
          blur={1.5}
          far={4.5}
        />
        
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
      
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Memuat model 3D...</p>
        </div>
      )}
      
      {error && (
        <div className="error-overlay">
          <p>{error}</p>
        </div>
      )}
      
      {!selectedModel && (
        <div className="no-model-overlay">
          <h3>Pilih Model 3D</h3>
          <p>Gunakan panel kontrol di sebelah kiri untuk memilih atau upload model furniture</p>
        </div>
      )}

      {modelInfo && (
        <div className="model-info-overlay">
          <h4>Model Info</h4>
          <p>Vertices: {modelInfo.vertices.toLocaleString()}</p>
          <p>Faces: {modelInfo.faces.toLocaleString()}</p>
          <p>Materials: {modelInfo.materials}</p>
          <p>Animations: {modelInfo.animations}</p>
        </div>
      )}
    </div>
  );
}

function Model3D({ model, scale, position, rotation, onLoad, onError, onLoadingStart }) {
  const meshRef = useRef();
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadedModel, setLoadedModel] = useState(null);

  const loadModel = useCallback(async () => {
    if (!model?.url) return;
    
    try {
      onLoadingStart();
      let loadedModelData;
      
      if (model.url.endsWith('.usdz')) {
        loadedModelData = await modelLoader.loadUSDZ(model.url);
      } else {
        loadedModelData = await modelLoader.loadGLB(model.url);
      }
      
      setLoadedModel(loadedModelData);
      setIsLoaded(true);
      
      const info = modelLoader.getModelInfo(loadedModelData);
      onLoad(info);
    } catch (error) {
      console.error('Model loading error:', error);
      onError(error);
    }
  }, [model?.url, onLoad, onError, onLoadingStart]);

  useEffect(() => {
    if (model?.url) {
      loadModel();
    }
  }, [model?.url, loadModel]);

  useFrame(() => {
    if (meshRef.current && isLoaded) {
      // Update model properties
      meshRef.current.scale.setScalar(scale);
      meshRef.current.position.set(position.x, position.y, position.z);
      meshRef.current.rotation.set(
        THREE.MathUtils.degToRad(rotation.x),
        THREE.MathUtils.degToRad(rotation.y),
        THREE.MathUtils.degToRad(rotation.z)
      );
    }
  });

  if (!isLoaded || !loadedModel) {
    return null;
  }

  return (
    <primitive
      ref={meshRef}
      object={loadedModel.scene.clone()}
      scale={scale}
      position={[position.x, position.y, position.z]}
      rotation={[
        THREE.MathUtils.degToRad(rotation.x),
        THREE.MathUtils.degToRad(rotation.y),
        THREE.MathUtils.degToRad(rotation.z)
      ]}
    />
  );
}

function PlaceholderModel() {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial 
        color="#667eea" 
        transparent 
        opacity={0.7}
        wireframe
      />
    </mesh>
  );
}

export { ModelViewer };