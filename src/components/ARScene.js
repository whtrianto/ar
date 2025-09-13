import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { useXR } from '@react-three/xr';
import { ARPlacement } from './ARPlacement';
import { modelLoader } from '../utils/modelLoader';
import * as THREE from 'three';

function ARScene({ selectedModel, scale, position, rotation }) {
  const [loadedModel, setLoadedModel] = useState(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  const loadModel = useCallback(async () => {
    try {
      let modelData;
      
      if (selectedModel.url.endsWith('.usdz')) {
        modelData = await modelLoader.loadUSDZ(selectedModel.url);
      } else {
        modelData = await modelLoader.loadGLB(selectedModel.url);
      }
      
      setLoadedModel(modelData);
      setIsModelLoaded(true);
    } catch (error) {
      console.error('Error loading model for AR:', error);
    }
  }, [selectedModel?.url]);

  useEffect(() => {
    if (selectedModel?.url) {
      loadModel();
    }
  }, [selectedModel?.url, loadModel]);

  const handlePlacement = (placementPosition, placementRotation) => {
    console.log('Model placed at:', placementPosition);
    console.log('Model rotation:', placementRotation);
  };

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      
      {/* AR Placement System */}
      {isModelLoaded && loadedModel && (
        <ARPlacement onPlacement={handlePlacement}>
          <ARModel3D
            model={loadedModel}
            scale={scale}
            position={position}
            rotation={rotation}
          />
        </ARPlacement>
      )}

      {/* AR Controller */}
      <ARController />
    </>
  );
}

function ARModel3D({ model, scale, position, rotation }) {
  const meshRef = useRef();

  useFrame(() => {
    if (meshRef.current) {
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

  return (
    <primitive
      ref={meshRef}
      object={model.scene.clone()}
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

function ARController() {
  const { isPresenting, session } = useXR();
  const controllerRef = useRef();

  useEffect(() => {
    if (isPresenting && session) {
      // Add AR session event listeners
      const handleSelect = () => {
        console.log('AR Controller select pressed');
      };

      const handleSelectStart = () => {
        console.log('AR Controller select start');
      };

      const handleSelectEnd = () => {
        console.log('AR Controller select end');
      };

      session.addEventListener('select', handleSelect);
      session.addEventListener('selectstart', handleSelectStart);
      session.addEventListener('selectend', handleSelectEnd);

      return () => {
        session.removeEventListener('select', handleSelect);
        session.removeEventListener('selectstart', handleSelectStart);
        session.removeEventListener('selectend', handleSelectEnd);
      };
    }
  }, [isPresenting, session]);

  return (
    <mesh ref={controllerRef} visible={false}>
      <boxGeometry args={[0.02, 0.02, 0.1]} />
      <meshBasicMaterial color="red" />
    </mesh>
  );
}

export { ARScene };