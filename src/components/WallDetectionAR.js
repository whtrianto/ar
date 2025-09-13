import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { modelLoader } from '../utils/modelLoader';

function WallDetectionAR({ selectedModel, scale, position, rotation, onPlacement }) {
  const canvasRef = useRef();
  const sceneRef = useRef();
  const rendererRef = useRef();
  const cameraRef = useRef();
  const [isARSupported, setIsARSupported] = useState(false);
  const [isPlaced, setIsPlaced] = useState(false);
  const [placementMode, setPlacementMode] = useState('floor');
  const [hitTestSource, setHitTestSource] = useState(null);
  const [referenceSpace, setReferenceSpace] = useState(null);
  const [modelMesh, setModelMesh] = useState(null);

  const initializeAR = useCallback(async () => {
    try {
      // Check WebXR support
      if (!navigator.xr) {
        console.log('WebXR not supported');
        return;
      }

      const supported = await navigator.xr.isSessionSupported('immersive-ar');
      if (!supported) {
        console.log('AR not supported');
        return;
      }

      setIsARSupported(true);
      setupThreeJS();
    } catch (error) {
      console.error('AR initialization error:', error);
    }
  }, []);

  const setupThreeJS = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.01, 1000);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvas, 
      alpha: true, 
      antialias: true 
    });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.xr.enabled = true;
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    scene.add(directionalLight);

    // Add floor and wall indicators
    addPlacementIndicators(scene);

    // Start render loop
    renderer.setAnimationLoop(render);
  }, []);

  const addPlacementIndicators = useCallback((scene) => {
    // Floor indicator
    const floorGeometry = new THREE.PlaneGeometry(2, 2);
    const floorMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x00ff00, 
      transparent: true, 
      opacity: 0.3,
      side: THREE.DoubleSide
    });
    const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.userData = { type: 'floor' };
    scene.add(floorMesh);

    // Wall indicator
    const wallGeometry = new THREE.PlaneGeometry(1, 2);
    const wallMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x0000ff, 
      transparent: true, 
      opacity: 0.3,
      side: THREE.DoubleSide
    });
    const wallMesh = new THREE.Mesh(wallGeometry, wallMaterial);
    wallMesh.position.z = -1;
    wallMesh.userData = { type: 'wall' };
    scene.add(wallMesh);
  }, []);

  const render = useCallback(() => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;
    rendererRef.current.render(sceneRef.current, cameraRef.current);
  }, []);

  const updateModelProperties = useCallback(() => {
    if (!modelMesh) return;

    modelMesh.scale.setScalar(scale);
    modelMesh.position.set(position.x, position.y, position.z);
    modelMesh.rotation.set(
      THREE.MathUtils.degToRad(rotation.x),
      THREE.MathUtils.degToRad(rotation.y),
      THREE.MathUtils.degToRad(rotation.z)
    );
  }, [modelMesh, scale, position, rotation]);

  useEffect(() => {
    initializeAR();
    return () => {
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [initializeAR]);

  useEffect(() => {
    if (selectedModel && modelMesh) {
      updateModelProperties();
    }
  }, [selectedModel, modelMesh, updateModelProperties]);

  const startARSession = async () => {
    try {
      const session = await navigator.xr.requestSession('immersive-ar', {
        requiredFeatures: ['local', 'hit-test'],
        optionalFeatures: ['dom-overlay']
      });

      await rendererRef.current.xr.setSession(session);

      // Get reference space
      const refSpace = await session.requestReferenceSpace('local');
      setReferenceSpace(refSpace);

      // Get hit test source
      const hitTestSource = await session.requestHitTestSource({ space: refSpace });
      setHitTestSource(hitTestSource);

      // Add event listeners
      session.addEventListener('end', onSessionEnd);
      session.addEventListener('select', onSelect);

    } catch (error) {
      console.error('AR session error:', error);
    }
  };

  const onSessionEnd = () => {
    setIsPlaced(false);
    setHitTestSource(null);
    setReferenceSpace(null);
  };

  const onSelect = (event) => {
    if (!hitTestSource || !referenceSpace) return;

    const frame = event.frame;
    // Fallback: if hit-test results unavailable or complex, place model at a default distance in front of camera
    try {
      const hitTestResults = frame.getHitTestResults ? frame.getHitTestResults(hitTestSource) : [];

      if (hitTestResults && hitTestResults.length > 0) {
        const hit = hitTestResults[0];
        const pose = hit.getPose(referenceSpace);
        if (pose) {
          const position = pose.transform.position;
          const orientation = pose.transform.orientation;
          placeModel(position, orientation);
          return;
        }
      }
    } catch (err) {
      console.warn('Hit test fallback:', err);
    }

    // Default placement: 1 meter in front of the camera
    if (rendererRef.current && rendererRef.current.xr && rendererRef.current.xr.getCamera) {
      const cam = rendererRef.current.xr.getCamera();
      const dir = new THREE.Vector3(0, 0, -1).applyQuaternion(cam.quaternion);
      const pos = cam.position.clone().add(dir.multiplyScalar(1.0));
      const orientation = cam.quaternion;
      placeModel({ x: pos.x, y: pos.y, z: pos.z }, { x: orientation.x, y: orientation.y, z: orientation.z, w: orientation.w });
    }
  };

  const placeModel = (position, orientation) => {
    if (!selectedModel || !sceneRef.current) return;

    // Remove existing model
    if (modelMesh) {
      sceneRef.current.remove(modelMesh);
    }

    // Create new model
    loadAndPlaceModel(position, orientation);
    setIsPlaced(true);
  };

  const loadAndPlaceModel = async (position, orientation) => {
    try {
      let modelData;
      if (selectedModel.url.endsWith('.usdz')) {
        modelData = await modelLoader.loadUSDZ(selectedModel.url);
      } else {
        modelData = await modelLoader.loadGLB(selectedModel.url);
      }

      const model = modelData.scene.clone();
      model.scale.setScalar(scale);
      model.position.set(position.x, position.y, position.z);
      model.quaternion.set(orientation.x, orientation.y, orientation.z, orientation.w);

      sceneRef.current.add(model);
      setModelMesh(model);

      onPlacement && onPlacement({ position, orientation });

    } catch (error) {
      console.error('Model loading error:', error);
      // Create fallback model
      createFallbackModel(position, orientation);
    }
  };

  const createFallbackModel = (position, orientation) => {
    const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const material = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const mesh = new THREE.Mesh(geometry, material);
    
    mesh.position.set(position.x, position.y, position.z);
    mesh.quaternion.set(orientation.x, orientation.y, orientation.z, orientation.w);
    mesh.scale.setScalar(scale);

    sceneRef.current.add(mesh);
    setModelMesh(mesh);
  };


  const togglePlacementMode = () => {
    setPlacementMode(placementMode === 'floor' ? 'wall' : 'floor');
  };

  return (
    <div className="wall-detection-ar-container">
      <canvas 
        ref={canvasRef} 
        className="ar-canvas"
        style={{ width: '100%', height: '100%' }}
      />
      
      <div className="ar-controls-overlay">
        <button 
          className="ar-start-btn"
          onClick={startARSession}
          disabled={!isARSupported}
        >
          {isARSupported ? '🚀 Start AR' : 'AR Tidak Didukung'}
        </button>
        
        <button 
          className="placement-mode-btn"
          onClick={togglePlacementMode}
        >
          {placementMode === 'floor' ? '🎯 Floor Mode' : '🧱 Wall Mode'}
        </button>
        
        {isPlaced && (
          <button 
            className="reset-btn"
            onClick={() => {
              if (modelMesh && sceneRef.current) {
                sceneRef.current.remove(modelMesh);
                setModelMesh(null);
                setIsPlaced(false);
              }
            }}
          >
            🔄 Reset
          </button>
        )}
      </div>

      <div className="ar-instructions">
        <h3>AR Instructions</h3>
        <p>
          {placementMode === 'floor' 
            ? '📱 Gerakkan kamera dan tap di lantai untuk menempatkan model'
            : '📱 Gerakkan kamera dan tap di dinding untuk menempatkan model'
          }
        </p>
        <p>Mode: {placementMode === 'floor' ? 'Floor Detection' : 'Wall Detection'}</p>
      </div>
    </div>
  );
}

export { WallDetectionAR };
