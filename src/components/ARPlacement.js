import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useXR } from '@react-three/xr';
import * as THREE from 'three';

function ARPlacement({ 
  selectedModel, 
  placementMode, 
  onModelPlaced, 
  modelPosition, 
  setModelPosition 
}) {
  const { camera, raycaster, scene } = useThree();
  const { isPresenting } = useXR();
  const [, setIsPlaced] = useState(false);
  const [hitPoint, setHitPoint] = useState(null);
  const [hitNormal, setHitNormal] = useState(null);
  const [isValidPlacement, setIsValidPlacement] = useState(false);
  
  const planeRef = useRef();
  const wallRef = useRef();
  const reticleRef = useRef();

  // Create reticle for placement indication
  useEffect(() => {
    if (!reticleRef.current) return;

    const reticleGeometry = new THREE.RingGeometry(0.1, 0.2, 32);
    const reticleMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x00ff00, 
      transparent: true, 
      opacity: 0.8 
    });
    
    reticleRef.current.geometry = reticleGeometry;
    reticleRef.current.material = reticleMaterial;
    reticleRef.current.visible = false;
  }, []);

  // Create plane for floor detection
  useEffect(() => {
    if (!planeRef.current) return;

    const planeGeometry = new THREE.PlaneGeometry(10, 10);
    const planeMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x00ff00, 
      transparent: true, 
      opacity: 0.1,
      side: THREE.DoubleSide
    });
    
    planeRef.current.geometry = planeGeometry;
    planeRef.current.material = planeMaterial;
    planeRef.current.rotation.x = -Math.PI / 2; // Rotate to be horizontal
    planeRef.current.visible = false;
  }, []);

  // Create wall for wall detection
  useEffect(() => {
    if (!wallRef.current) return;

    const wallGeometry = new THREE.PlaneGeometry(5, 5);
    const wallMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x0066ff, 
      transparent: true, 
      opacity: 0.1,
      side: THREE.DoubleSide
    });
    
    wallRef.current.geometry = wallGeometry;
    wallRef.current.material = wallMaterial;
    wallRef.current.visible = false;
  }, []);

  useFrame(() => {
    if (!isPresenting || !selectedModel) return;

    // Cast ray from camera center
    raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
    
    // For floor detection
    if (placementMode === 'floor') {
      // Create a horizontal plane at y=0 for floor detection
      const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const intersectionPoint = new THREE.Vector3();
      
      if (raycaster.ray.intersectPlane(floorPlane, intersectionPoint)) {
        setHitPoint(intersectionPoint);
        setHitNormal(new THREE.Vector3(0, 1, 0));
        setIsValidPlacement(true);
        
        if (reticleRef.current) {
          reticleRef.current.position.copy(intersectionPoint);
          reticleRef.current.visible = true;
        }
        
        if (planeRef.current) {
          planeRef.current.position.copy(intersectionPoint);
          planeRef.current.visible = true;
        }
      } else {
        setIsValidPlacement(false);
        if (reticleRef.current) {
          reticleRef.current.visible = false;
        }
        if (planeRef.current) {
          planeRef.current.visible = false;
        }
      }
    }
    
    // For wall detection
    if (placementMode === 'wall') {
      // Try to find walls by casting rays and checking for vertical surfaces
      const intersections = raycaster.intersectObjects(scene.children, true);
      
      let bestWall = null;
      let bestDistance = Infinity;
      
      intersections.forEach(intersection => {
        if (intersection.face) {
          const normal = intersection.face.normal.clone();
          normal.transformDirection(intersection.object.matrixWorld);
          
          // Check if the surface is roughly vertical (wall-like)
          const verticalComponent = Math.abs(normal.y);
          if (verticalComponent < 0.5) { // Less than 30 degrees from vertical
            if (intersection.distance < bestDistance) {
              bestDistance = intersection.distance;
              bestWall = {
                point: intersection.point,
                normal: normal,
                distance: intersection.distance
              };
            }
          }
        }
      });
      
      if (bestWall) {
        setHitPoint(bestWall.point);
        setHitNormal(bestWall.normal);
        setIsValidPlacement(true);
        
        if (reticleRef.current) {
          reticleRef.current.position.copy(bestWall.point);
          reticleRef.current.lookAt(bestWall.point.clone().add(bestWall.normal));
          reticleRef.current.visible = true;
        }
        
        if (wallRef.current) {
          wallRef.current.position.copy(bestWall.point);
          wallRef.current.lookAt(bestWall.point.clone().add(bestWall.normal));
          wallRef.current.visible = true;
        }
      } else {
        setIsValidPlacement(false);
        if (reticleRef.current) {
          reticleRef.current.visible = false;
        }
        if (wallRef.current) {
          wallRef.current.visible = false;
        }
      }
    }
  });

  // Handle tap/click for placement
  const handlePlacement = useCallback(() => {
    if (!isValidPlacement || !hitPoint) return;
    
    const newPosition = hitPoint.toArray();
    setModelPosition(newPosition);
    setIsPlaced(true);
    onModelPlaced && onModelPlaced(newPosition, hitNormal);
  }, [isValidPlacement, hitPoint, hitNormal, setModelPosition, onModelPlaced]);

  // Listen for tap events
  useEffect(() => {
    const handleTap = (event) => {
      if (isPresenting && isValidPlacement) {
        handlePlacement();
      }
    };

    // Add event listeners for different input methods
    window.addEventListener('click', handleTap);
    window.addEventListener('touchend', handleTap);
    
    return () => {
      window.removeEventListener('click', handleTap);
      window.removeEventListener('touchend', handleTap);
    };
  }, [isPresenting, isValidPlacement, hitPoint, handlePlacement]);

  if (!isPresenting || !selectedModel) return null;

  return (
    <group>
      {/* Reticle for placement indication */}
      <mesh ref={reticleRef} />
      
      {/* Floor plane indicator */}
      {placementMode === 'floor' && (
        <mesh ref={planeRef} />
      )}
      
      {/* Wall plane indicator */}
      {placementMode === 'wall' && (
        <mesh ref={wallRef} />
      )}
      
      {/* Instructions overlay - moved to parent component to avoid conflicts */}
    </group>
  );
}

export { ARPlacement };