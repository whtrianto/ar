import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useXR } from '@react-three/xr';
import * as THREE from 'three';

function ARPlacement({ onPlacement, children }) {
  const { isPresenting, session } = useXR();
  const [isPlaced, setIsPlaced] = useState(false);
  const [placementPosition, setPlacementPosition] = useState(new THREE.Vector3(0, 0, 0));
  const [placementRotation, setPlacementRotation] = useState(new THREE.Euler(0, 0, 0));
  const [hitTestSource, setHitTestSource] = useState(null);
  const [hitTestSourceRequested, setHitTestSourceRequested] = useState(false);
  const referenceSpace = useRef(null);

  useEffect(() => {
    if (isPresenting && session && !hitTestSourceRequested) {
      const onSessionStart = async () => {
        try {
          // Get reference space
          referenceSpace.current = await session.requestReferenceSpace('local');
          
          // Request hit test source
          const hitTestSource = await session.requestHitTestSource({ space: referenceSpace.current });
          setHitTestSource(hitTestSource);
          setHitTestSourceRequested(true);
        } catch (error) {
          console.error('Failed to initialize hit test:', error);
        }
      };

      onSessionStart();
    }
  }, [isPresenting, session, hitTestSourceRequested]);

  useFrame((state, delta) => {
    if (isPresenting && hitTestSource && session) {
      const frame = state.gl.xr.getFrame();
      const referenceSpace = frame.session.requestReferenceSpace('local');
      
      // Perform hit test
      const hitTestResults = frame.getHitTestResults(hitTestSource);
      
      if (hitTestResults.length > 0) {
        const hit = hitTestResults[0];
        const pose = hit.getPose(referenceSpace);
        
        if (pose) {
          const position = pose.transform.position;
          const orientation = pose.transform.orientation;
          
          // Convert to Three.js coordinates
          const threePosition = new THREE.Vector3(
            position.x,
            position.y,
            position.z
          );
          
          const threeRotation = new THREE.Euler().setFromQuaternion(
            new THREE.Quaternion(
              orientation.x,
              orientation.y,
              orientation.z,
              orientation.w
            )
          );

          setPlacementPosition(threePosition);
          setPlacementRotation(threeRotation);
        }
      }
    }
  });

  const handlePlacement = () => {
    if (!isPlaced) {
      setIsPlaced(true);
      onPlacement(placementPosition, placementRotation);
    }
  };

  const handleReset = () => {
    setIsPlaced(false);
    setPlacementPosition(new THREE.Vector3(0, 0, 0));
    setPlacementRotation(new THREE.Euler(0, 0, 0));
  };

  return (
    <group>
      {/* Floor Detection Visual */}
      {isPresenting && !isPlaced && (
        <FloorDetectionVisual 
          position={placementPosition}
          rotation={placementRotation}
        />
      )}
      
      {/* Wall Detection Visual */}
      {isPresenting && !isPlaced && (
        <WallDetectionVisual 
          position={placementPosition}
          rotation={placementRotation}
        />
      )}
      
      {/* Placed Model */}
      {isPlaced && (
        <group position={placementPosition} rotation={placementRotation}>
          {children}
        </group>
      )}
      
      {/* Placement Controls */}
      {isPresenting && (
        <ARPlacementControls
          onPlace={handlePlacement}
          onReset={handleReset}
          isPlaced={isPlaced}
        />
      )}
    </group>
  );
}

function FloorDetectionVisual({ position, rotation }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      // Animate the floor indicator
      meshRef.current.material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
  });

  return (
    <mesh ref={meshRef} position={[position.x, position.y, position.z]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[2, 2]} />
      <meshBasicMaterial 
        color="#00ff00" 
        transparent 
        opacity={0.3}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function WallDetectionVisual({ position, rotation }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      // Animate the wall indicator
      meshRef.current.material.opacity = 0.2 + Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={[position.x, position.y + 1, position.z - 1]} rotation={[0, 0, 0]}>
      <planeGeometry args={[1, 2]} />
      <meshBasicMaterial 
        color="#0000ff" 
        transparent 
        opacity={0.2}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function ARPlacementControls({ onPlace, onReset, isPlaced }) {
  return (
    <div style={{
      position: 'absolute',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 10,
      display: 'flex',
      gap: '10px'
    }}>
      {!isPlaced ? (
        <button
          onClick={onPlace}
          style={{
            padding: '12px 24px',
            background: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
          }}
        >
          📍 Tempatkan Model
        </button>
      ) : (
        <button
          onClick={onReset}
          style={{
            padding: '12px 24px',
            background: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(220, 53, 69, 0.3)'
          }}
        >
          🔄 Reset Posisi
        </button>
      )}
    </div>
  );
}

export { ARPlacement };
