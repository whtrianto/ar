import React, { useState } from 'react';

const SAMPLE_MODELS = [
  {
    id: 'chair-1',
    name: 'Modern Chair',
    url: '/models/sample-chair.glb',
    description: 'Kursi modern dengan desain minimalis',
    category: 'furniture',
    arPlacement: 'floor',
    thumbnail: 'https://via.placeholder.com/200x150/667eea/ffffff?text=Chair'
  },
  {
    id: 'lamp-1',
    name: 'Table Lamp',
    url: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
    description: 'Lampu meja dengan desain modern',
    category: 'lighting',
    arPlacement: 'floor',
    thumbnail: 'https://via.placeholder.com/200x150/28a745/ffffff?text=Lamp'
  },
  {
    id: 'picture-1',
    name: 'Wall Art',
    url: 'https://modelviewer.dev/shared-assets/models/NeilArmstrong.glb',
    description: 'Lukisan dinding untuk dekorasi',
    category: 'decoration',
    arPlacement: 'wall',
    thumbnail: 'https://via.placeholder.com/200x150/dc3545/ffffff?text=Art'
  },
  {
    id: 'sofa-1',
    name: 'Comfort Sofa',
    url: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
    description: 'Sofa nyaman untuk ruang tamu',
    category: 'furniture',
    arPlacement: 'floor',
    thumbnail: 'https://via.placeholder.com/200x150/ffc107/ffffff?text=Sofa'
  },
  {
    id: 'table-1',
    name: 'Coffee Table',
    url: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
    description: 'Meja kopi dengan desain elegan',
    category: 'furniture',
    arPlacement: 'floor',
    thumbnail: 'https://via.placeholder.com/200x150/17a2b8/ffffff?text=Table'
  },
  {
    id: 'shelf-1',
    name: 'Wall Shelf',
    url: 'https://modelviewer.dev/shared-assets/models/NeilArmstrong.glb',
    description: 'Rak dinding untuk dekorasi',
    category: 'storage',
    arPlacement: 'wall',
    thumbnail: 'https://via.placeholder.com/200x150/6f42c1/ffffff?text=Shelf'
  }
];

function ModelGallery({ onModelSelect, selectedModel }) {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['all', 'furniture', 'lighting', 'decoration', 'storage'];

  const filteredModels = SAMPLE_MODELS.filter(model => {
    const matchesCategory = filter === 'all' || model.category === filter;
    const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         model.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="model-gallery">
      <div className="gallery-header">
        <h3>Model Gallery</h3>
        <div className="gallery-controls">
          <input
            type="text"
            placeholder="Search models..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="category-filter"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="gallery-grid">
        {filteredModels.map(model => (
          <div
            key={model.id}
            className={`model-card ${selectedModel?.id === model.id ? 'selected' : ''}`}
            onClick={() => onModelSelect(model)}
          >
            <div className="model-thumbnail">
              <img src={model.thumbnail} alt={model.name} />
              <div className="placement-indicator">
                {model.arPlacement === 'floor' ? '🏠' : '🧱'}
              </div>
            </div>
            <div className="model-info">
              <h4>{model.name}</h4>
              <p>{model.description}</p>
              <div className="model-tags">
                <span className="tag category">{model.category}</span>
                <span className="tag placement">{model.arPlacement}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredModels.length === 0 && (
        <div className="no-models">
          <p>No models found matching your criteria</p>
        </div>
      )}

      <div className="gallery-footer">
        <p>Click on any model to view it in 3D and AR</p>
      </div>
    </div>
  );
}

export { ModelGallery };
