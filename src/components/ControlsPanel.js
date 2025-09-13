import React, { useState, useRef } from 'react';

const SAMPLE_MODELS = [
  {
    id: 'chair-1',
    name: 'Modern Chair',
    url: 'https://threejs.org/examples/models/gltf/duck/duck.gltf',
    description: 'Kursi modern dengan desain minimalis (Sample Duck Model)',
    category: 'furniture'
  },
  {
    id: 'table-1',
    name: 'Dining Table',
    url: 'https://threejs.org/examples/models/gltf/duck/duck.gltf',
    description: 'Meja makan untuk 4 orang (Sample Duck Model)',
    category: 'furniture'
  },
  {
    id: 'sofa-1',
    name: 'L-Shaped Sofa',
    url: 'https://threejs.org/examples/models/gltf/duck/duck.gltf',
    description: 'Sofa berbentuk L dengan bantal empuk (Sample Duck Model)',
    category: 'furniture'
  },
  {
    id: 'lamp-1',
    name: 'Floor Lamp',
    url: 'https://threejs.org/examples/models/gltf/duck/duck.gltf',
    description: 'Lampu lantai dengan desain modern (Sample Duck Model)',
    category: 'lighting'
  }
];

function ControlsPanel({
  selectedModel,
  onModelSelect,
  scale,
  position,
  rotation,
  onScaleChange,
  onPositionChange,
  onRotationChange,
  onResetModel,
  isARMode,
  onARModeToggle,
  isWebXRSupported,
  arMode,
  onArModeChange
}) {
  const fileInputRef = useRef();
  const [showModelList, setShowModelList] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      const model = {
        id: `uploaded-${Date.now()}`,
        name: file.name.replace(/\.(glb|usdz)$/i, ''),
        url: fileUrl,
        description: `Uploaded model: ${file.name}`,
        category: 'uploaded'
      };
      onModelSelect(model);
    }
  };

  const handleModelSelect = (model) => {
    onModelSelect(model);
    setShowModelList(false);
  };

  const handleScaleChange = (event) => {
    const value = parseFloat(event.target.value);
    onScaleChange(value);
  };

  const handlePositionChange = (axis, value) => {
    const newPosition = { ...position, [axis]: parseFloat(value) };
    onPositionChange(newPosition);
  };

  const handleRotationChange = (axis, value) => {
    const newRotation = { ...rotation, [axis]: parseFloat(value) };
    onRotationChange(newRotation);
  };

  return (
    <div className="controls-panel">
      <h2>🎛️ Kontrol AR</h2>
      
      {/* Model Selection */}
      <div className="control-group">
        <label>Pilih Model 3D</label>
        <div className="button-group">
          <button 
            className="btn btn-primary"
            onClick={() => setShowModelList(!showModelList)}
          >
            {selectedModel ? selectedModel.name : 'Pilih Model'}
          </button>
          <button 
            className="btn btn-success"
            onClick={() => fileInputRef.current?.click()}
          >
            Upload
          </button>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".glb,.usdz"
          onChange={handleFileUpload}
          className="file-input"
        />
        
        {showModelList && (
          <div className="model-list">
            {SAMPLE_MODELS.map((model) => (
              <div
                key={model.id}
                className={`model-item ${selectedModel?.id === model.id ? 'selected' : ''}`}
                onClick={() => handleModelSelect(model)}
              >
                <h4>{model.name}</h4>
                <p>{model.description}</p>
              </div>
            ))}
          </div>
        )}
        
        {selectedModel && (
          <div className="model-info">
            <strong>Model Aktif:</strong> {selectedModel.name}<br/>
            <strong>Kategori:</strong> {selectedModel.category}<br/>
            <strong>Format:</strong> {selectedModel.url.includes('.usdz') ? 'USDZ' : 'GLB'}
          </div>
        )}
      </div>

      {/* Scale Control */}
      <div className="control-group">
        <label>Skala Model: {scale.toFixed(2)}x</label>
        <div className="slider-container">
          <input
            type="range"
            min="0.1"
            max="3"
            step="0.1"
            value={scale}
            onChange={handleScaleChange}
            className="slider"
          />
          <span className="slider-value">{scale.toFixed(1)}x</span>
        </div>
      </div>

      {/* Position Controls */}
      <div className="control-group">
        <label>Posisi Model</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
          <div>
            <label style={{ fontSize: '12px' }}>X</label>
            <input
              type="number"
              value={position.x}
              onChange={(e) => handlePositionChange('x', e.target.value)}
              step="0.1"
              style={{ fontSize: '12px', padding: '4px' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px' }}>Y</label>
            <input
              type="number"
              value={position.y}
              onChange={(e) => handlePositionChange('y', e.target.value)}
              step="0.1"
              style={{ fontSize: '12px', padding: '4px' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px' }}>Z</label>
            <input
              type="number"
              value={position.z}
              onChange={(e) => handlePositionChange('z', e.target.value)}
              step="0.1"
              style={{ fontSize: '12px', padding: '4px' }}
            />
          </div>
        </div>
      </div>

      {/* Rotation Controls */}
      <div className="control-group">
        <label>Rotasi Model (Derajat)</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
          <div>
            <label style={{ fontSize: '12px' }}>X</label>
            <input
              type="number"
              value={rotation.x}
              onChange={(e) => handleRotationChange('x', e.target.value)}
              step="1"
              style={{ fontSize: '12px', padding: '4px' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px' }}>Y</label>
            <input
              type="number"
              value={rotation.y}
              onChange={(e) => handleRotationChange('y', e.target.value)}
              step="1"
              style={{ fontSize: '12px', padding: '4px' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px' }}>Z</label>
            <input
              type="number"
              value={rotation.z}
              onChange={(e) => handleRotationChange('z', e.target.value)}
              step="1"
              style={{ fontSize: '12px', padding: '4px' }}
            />
          </div>
        </div>
      </div>

      {/* AR Mode Selection */}
      {isARMode && (
        <div className="control-group">
          <label>AR Mode</label>
          <select 
            value={arMode} 
            onChange={(e) => onArModeChange(e.target.value)}
            className="ar-mode-select"
          >
            <option value="model-viewer">Model Viewer AR (Floor Only)</option>
            <option value="wall-detection">Wall Detection AR</option>
            <option value="advanced">Advanced AR (Floor + Wall)</option>
            <option value="simple">Simple AR (Testing)</option>
          </select>
        </div>
      )}

      {/* Action Buttons */}
      <div className="button-group">
        <button 
          className="btn btn-secondary"
          onClick={onResetModel}
          disabled={!selectedModel}
        >
          Reset
        </button>
        <button 
          className="btn btn-danger"
          onClick={onARModeToggle}
          disabled={!selectedModel || !isWebXRSupported}
        >
          {isARMode ? 'Keluar AR' : 'Mode AR'}
        </button>
      </div>

      {/* AR Instructions */}
      {!isARMode && (
        <div className="model-info">
          <strong>💡 Tips AR:</strong><br/>
          • Pastikan browser mendukung WebXR<br/>
          • Gunakan Chrome mobile untuk hasil terbaik<br/>
          • Atur posisi dan skala model sebelum masuk AR<br/>
          • Tap layar untuk menempatkan model di AR
        </div>
      )}

      {isARMode && (
        <div className="model-info">
          <strong>🎯 Mode AR Aktif:</strong><br/>
          • Gerakkan kamera untuk scan area<br/>
          • Tap di lantai untuk menempatkan model<br/>
          • Gunakan gesture untuk memutar/zoom model
        </div>
      )}
    </div>
  );
}

export { ControlsPanel };
