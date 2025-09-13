import React, { useRef, useEffect, useState, useCallback } from 'react';
import { modelLoader } from '../utils/modelLoader';
import * as THREE from 'three';

function AdvancedAR({ selectedModel, scale, position, rotation, onPlacement }) {
  const canvasRef = useRef();
  const [isARSupported, setIsARSupported] = useState(false);
  const [isPlaced, setIsPlaced] = useState(false);
  const [placementMode, setPlacementMode] = useState('floor');
  const [hitTestSource, setHitTestSource] = useState(null);
  const [referenceSpace, setReferenceSpace] = useState(null);
  const [modelMesh, setModelMesh] = useState(null);
  const [scene, setScene] = useState(null);
  const [renderer, setRenderer] = useState(null);

  const setupThreeJS = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Scene
    const newScene = new THREE.Scene();
    setScene(newScene);

    // Camera
    const newCamera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.01, 1000);

    // Renderer
    const newRenderer = new THREE.WebGLRenderer({ 
      canvas: canvas, 
      alpha: true, 
      antialias: true 
    });
    newRenderer.setSize(canvas.clientWidth, canvas.clientHeight);
    newRenderer.setPixelRatio(window.devicePixelRatio);
    newRenderer.xr.enabled = true;
    setRenderer(newRenderer);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    newScene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    newScene.add(directionalLight);

    // Add placement indicators
    addPlacementIndicators(newScene);

    // Start render loop
    newRenderer.setAnimationLoop(() => render(newRenderer, newScene, newCamera));
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

  const render = useCallback((renderer, scene, camera) => {
    if (!renderer || !scene || !camera) return;
    renderer.render(scene, camera);
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
  }, [setupThreeJS]);

  useEffect(() => {
    initializeAR();
    return () => {
      if (renderer) {
        renderer.dispose();
      }
    };
  }, [initializeAR, renderer]);

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

      await renderer.xr.setSession(session);
      // AR session started

      // Get reference space
      const refSpace = await session.requestReferenceSpace('local');
      setReferenceSpace(refSpace);

      // Create hit test source
      const hitTestSource = await session.requestHitTestSource({ space: refSpace });
      setHitTestSource(hitTestSource);

      // Add event listeners
      session.addEventListener('end', onSessionEnd);
      session.addEventListener('select', onSelect);

      // Load model if selected
      if (selectedModel) {
        await loadModel();
      }

    } catch (error) {
      console.error('AR session error:', error);
    }
  };

  const onSessionEnd = () => {
    setIsPlaced(false);
    setHitTestSource(null);
    setReferenceSpace(null);
    // AR session ended
  };

  const onSelect = (event) => {
    if (!hitTestSource || !referenceSpace) return;

    const hitTestResults = event.frame.getHitTestResults(hitTestSource);
    if (hitTestResults.length > 0) {
      const hit = hitTestResults[0];
      const pose = hit.getPose(referenceSpace);
      
      if (pose) {
        const position = pose.transform.position;
        const orientation = pose.transform.orientation;
        
        // Analyze normal vector to determine surface type
        const normal = hit.getHitMatrix().getColumn(1);
        const isWall = Math.abs(normal.y) < 0.5; // Y component close to 0 = wall
        
        console.log('Normal vector analysis:', { normal, isWall });
        
        if (placementMode === 'wall' && !isWall) {
          console.log('Wall mode selected but floor detected');
          return;
        }
        
        if (placementMode === 'floor' && isWall) {
          console.log('Floor mode selected but wall detected');
          return;
        }

        // Place model
        if (modelMesh) {
          modelMesh.position.set(position.x, position.y, position.z);
          modelMesh.quaternion.set(orientation.x, orientation.y, orientation.z, orientation.w);
          
          if (isWall) {
            // Adjust rotation for wall placement
            modelMesh.rotation.y += Math.PI / 2;
          }
          
          setIsPlaced(true);
          onPlacement && onPlacement({
            position: { x: position.x, y: position.y, z: position.z },
            rotation: { 
              x: modelMesh.rotation.x, 
              y: modelMesh.rotation.y, 
              z: modelMesh.rotation.z 
            }
          });
          
          console.log(`Model placed at ${isWall ? 'wall' : 'floor'}`);
        }
      }
    }
  };

  const loadModel = async () => {
    try {
      if (!selectedModel) return;

      const model = await modelLoader.loadGLB(selectedModel.url);
      if (model && scene) {
        const mesh = model.scene || model;
        mesh.scale.setScalar(scale);
        mesh.position.set(position.x, position.y, position.z);
        mesh.rotation.set(
          THREE.MathUtils.degToRad(rotation.x),
          THREE.MathUtils.degToRad(rotation.y),
          THREE.MathUtils.degToRad(rotation.z)
        );

        scene.add(mesh);
        setModelMesh(mesh);
      }
    } catch (error) {
      console.error('Model loading error:', error);
    }
  };

  const togglePlacementMode = () => {
    setPlacementMode(placementMode === 'floor' ? 'wall' : 'floor');
  };

  if (!selectedModel) {
    return (
      <div className="advanced-ar-container">
        <div className="no-model-message">
          <h3>Pilih Model 3D</h3>
          <p>Gunakan panel kontrol untuk memilih model terlebih dahulu</p>
        </div>
      </div>
    );
  }

  return (
    <div className="advanced-ar-container">
      <canvas 
        ref={canvasRef} 
        className="ar-canvas"
        style={{ width: '100%', height: '100%' }}
      />
      
      <div className="ar-controls-overlay">
        <button 
          className={`placement-mode-btn ${placementMode === 'floor' ? 'active' : ''}`}
          onClick={togglePlacementMode}
        >
          {placementMode === 'floor' ? '🎯 Floor Mode' : '🧱 Wall Mode'}
        </button>
        
        <button 
          className="ar-start-btn"
          onClick={startARSession}
          disabled={!isARSupported}
        >
          {isARSupported ? '🚀 Start AR' : 'AR Tidak Didukung'}
        </button>
        
        {isPlaced && (
          <div className="placement-status">
            Model ditempatkan di {placementMode}!
          </div>
        )}
      </div>
    </div>
  );
}

export { AdvancedAR };