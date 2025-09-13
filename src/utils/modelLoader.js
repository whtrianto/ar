import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Model loader utility for GLB and USDZ files
export class ModelLoader {
  constructor() {
    this.gltfLoader = new GLTFLoader();
    this.loadingPromises = new Map();
  }

  // Load GLB model
  async loadGLB(url) {
    if (this.loadingPromises.has(url)) {
      return this.loadingPromises.get(url);
    }

    const promise = new Promise((resolve, reject) => {
      // Check if URL is valid
      if (!url || url === '') {
        reject(new Error('URL model tidak valid'));
        return;
      }

      this.gltfLoader.load(
        url,
        (gltf) => {
          // Process the loaded model
          const model = this.processGLTFModel(gltf);
          resolve(model);
        },
        (progress) => {
          console.log('Loading progress:', (progress.loaded / progress.total) * 100 + '%');
        },
        (error) => {
          console.error('Error loading GLB model:', error);
          // Create a fallback model if loading fails
          const fallbackModel = this.createFallbackModel();
          resolve(fallbackModel);
        }
      );
    });

    this.loadingPromises.set(url, promise);
    return promise;
  }

  // Load USDZ model (requires special handling)
  async loadUSDZ(url) {
    // For USDZ, we need to use a different approach
    // This is a simplified implementation - in production you might want to use
    // a proper USDZ loader or convert USDZ to GLB
    return new Promise((resolve, reject) => {
      // For now, we'll create a placeholder or try to load as GLB
      // In a real implementation, you'd use a USDZ loader
      console.warn('USDZ loading not fully implemented. Consider converting to GLB.');
      
      // Create a placeholder model
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshStandardMaterial({ 
        color: 0x888888,
        transparent: true,
        opacity: 0.8
      });
      const mesh = new THREE.Mesh(geometry, material);
      
      const model = {
        scene: mesh,
        animations: [],
        cameras: [],
        scenes: [mesh]
      };
      
      resolve(model);
    });
  }

  // Process GLTF model for better performance
  processGLTFModel(gltf) {
    const model = gltf.scene;
    
    // Optimize materials
    model.traverse((child) => {
      if (child.isMesh) {
        // Enable shadows
        child.castShadow = true;
        child.receiveShadow = true;
        
        // Optimize materials
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(material => this.optimizeMaterial(material));
          } else {
            this.optimizeMaterial(child.material);
          }
        }
      }
    });

    // Center and normalize the model
    this.centerModel(model);
    
    return {
      scene: model,
      animations: gltf.animations || [],
      cameras: gltf.cameras || [],
      scenes: gltf.scenes || [model]
    };
  }

  // Optimize material for better performance
  optimizeMaterial(material) {
    if (material.map) {
      material.map.anisotropy = 4;
    }
    
    if (material.normalMap) {
      material.normalMap.anisotropy = 4;
    }
    
    // Enable transparency if needed
    if (material.transparent) {
      material.transparent = true;
      material.opacity = material.opacity || 1;
    }
  }

  // Center the model at origin
  centerModel(model) {
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    
    // Center the model
    model.position.sub(center);
    
    // Normalize size (optional)
    const maxDimension = Math.max(size.x, size.y, size.z);
    if (maxDimension > 0) {
      const scale = 2 / maxDimension; // Scale to fit in 2x2x2 box
      model.scale.multiplyScalar(scale);
    }
  }

  // Get model info
  getModelInfo(model) {
    const info = {
      vertices: 0,
      faces: 0,
      materials: 0,
      textures: 0,
      animations: model.animations?.length || 0
    };

    model.scene.traverse((child) => {
      if (child.isMesh) {
        if (child.geometry) {
          if (child.geometry.attributes.position) {
            info.vertices += child.geometry.attributes.position.count;
          }
          if (child.geometry.index) {
            info.faces += child.geometry.index.count / 3;
          }
        }
        
        if (child.material) {
          if (Array.isArray(child.material)) {
            info.materials += child.material.length;
          } else {
            info.materials += 1;
          }
        }
      }
    });

    return info;
  }

  // Validate model file
  validateModelFile(file) {
    const validExtensions = ['.glb', '.usdz'];
    const fileName = file.name.toLowerCase();
    
    const isValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
    
    if (!isValidExtension) {
      throw new Error('Format file tidak didukung. Gunakan file GLB atau USDZ.');
    }

    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      throw new Error('Ukuran file terlalu besar. Maksimal 50MB.');
    }

    return true;
  }

  // Create model preview
  createModelPreview(model, size = 1) {
    const preview = model.scene.clone();
    preview.scale.setScalar(size);
    
    // Remove animations for preview
    preview.traverse((child) => {
      if (child.animations) {
        child.animations = [];
      }
    });

    return preview;
  }

  // Create fallback model when loading fails
  createFallbackModel() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ 
      color: 0x888888,
      transparent: true,
      opacity: 0.8
    });
    const mesh = new THREE.Mesh(geometry, material);
    
    const model = {
      scene: mesh,
      animations: [],
      cameras: [],
      scenes: [mesh]
    };
    
    return model;
  }
}

// Export singleton instance
export const modelLoader = new ModelLoader();
