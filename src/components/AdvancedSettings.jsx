import { X, Settings, Sliders, Save } from 'lucide-react'
import { useState } from 'react'

function AdvancedSettings({ onClose, settings, onSave }) {
  const [quality, setQuality] = useState(settings.quality || 90)
  const [resize, setResize] = useState(settings.resize || false)
  const [width, setWidth] = useState(settings.width || '')
  const [height, setHeight] = useState(settings.height || '')
  const [format, setFormat] = useState(settings.format || 'auto')
  const [compression, setCompression] = useState(settings.compression || 'medium')

  const handleSave = () => {
    onSave({
      quality,
      resize,
      width,
      height,
      format,
      compression
    })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content settings-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="modal-header">
          <Settings size={32} />
          <h2>Advanced Settings</h2>
          <p className="modal-subtitle">Customize your conversion preferences</p>
        </div>

        <div className="settings-grid">
          <div className="setting-group">
            <label>
              <Sliders size={20} />
              Quality
            </label>
            <input 
              type="range" 
              min="1" 
              max="100" 
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
            />
            <span className="setting-value">{quality}%</span>
          </div>

          <div className="setting-group">
            <label>
              <input 
                type="checkbox"
                checked={resize}
                onChange={(e) => setResize(e.target.checked)}
              />
              Resize Images
            </label>
            {resize && (
              <div className="resize-inputs">
                <input 
                  type="number" 
                  placeholder="Width"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                />
                <span>×</span>
                <input 
                  type="number" 
                  placeholder="Height"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="setting-group">
            <label>Compression Level</label>
            <select value={compression} onChange={(e) => setCompression(e.target.value)}>
              <option value="low">Low (Better Quality)</option>
              <option value="medium">Medium (Balanced)</option>
              <option value="high">High (Smaller Size)</option>
            </select>
          </div>

          <div className="setting-group">
            <label>Output Format</label>
            <select value={format} onChange={(e) => setFormat(e.target.value)}>
              <option value="auto">Auto Detect</option>
              <option value="jpg">JPG</option>
              <option value="png">PNG</option>
              <option value="webp">WebP</option>
              <option value="pdf">PDF</option>
            </select>
          </div>
        </div>

        <div className="settings-presets">
          <h3>Quick Presets</h3>
          <div className="presets-grid">
            <button className="preset-btn" onClick={() => {
              setQuality(95)
              setCompression('low')
            }}>
              🎯 Best Quality
            </button>
            <button className="preset-btn" onClick={() => {
              setQuality(75)
              setCompression('medium')
            }}>
              ⚖️ Balanced
            </button>
            <button className="preset-btn" onClick={() => {
              setQuality(60)
              setCompression('high')
            }}>
              💾 Smallest Size
            </button>
            <button className="preset-btn" onClick={() => {
              setResize(true)
              setWidth(1920)
              setHeight(1080)
            }}>
              📱 Web Optimized
            </button>
          </div>
        </div>

        <button className="btn-primary" onClick={handleSave}>
          <Save size={20} />
          Save Settings
        </button>
      </div>
    </div>
  )
}

export default AdvancedSettings


