import { useState } from 'react'
import { FileImage, FileText, Film, Music, Package, Sparkles, Wand2 } from 'lucide-react'

function ConversionOptions({ file, onConvert, isConverting, aiFeatures, setAiFeatures, onCancel }) {
  const [selectedFormat, setSelectedFormat] = useState(null)

  const getFileType = (filename) => {
    const ext = filename.split('.').pop().toLowerCase()
    
    if (['jpg', 'jpeg', 'png', 'webp', 'heic', 'gif', 'bmp', 'svg'].includes(ext)) return 'image'
    if (['pdf'].includes(ext)) return 'pdf'
    if (['doc', 'docx'].includes(ext)) return 'document'
    if (['xls', 'xlsx'].includes(ext)) return 'spreadsheet'
    if (['mp4', 'avi', 'mov', 'webm', 'mkv'].includes(ext)) return 'video'
    if (['mp3', 'wav', 'ogg', 'm4a', 'flac'].includes(ext)) return 'audio'
    
    return 'other'
  }

  const fileType = getFileType(file.name)

  const conversionOptions = {
    image: [
      { format: 'jpg', label: 'JPG', icon: FileImage },
      { format: 'png', label: 'PNG', icon: FileImage },
      { format: 'webp', label: 'WebP', icon: FileImage },
      { format: 'pdf', label: 'PDF', icon: FileText }
    ],
    pdf: [
      { format: 'jpg', label: 'JPG Images', icon: FileImage },
      { format: 'png', label: 'PNG Images', icon: FileImage },
      { format: 'txt', label: 'Text (OCR)', icon: FileText },
      { format: 'docx', label: 'Word', icon: FileText }
    ],
    document: [
      { format: 'pdf', label: 'PDF', icon: FileText },
      { format: 'txt', label: 'Text', icon: FileText },
      { format: 'html', label: 'HTML', icon: FileText }
    ],
    video: [
      { format: 'mp4', label: 'MP4', icon: Film },
      { format: 'webm', label: 'WebM', icon: Film },
      { format: 'gif', label: 'GIF', icon: FileImage }
    ],
    audio: [
      { format: 'mp3', label: 'MP3', icon: Music },
      { format: 'wav', label: 'WAV', icon: Music },
      { format: 'ogg', label: 'OGG', icon: Music }
    ]
  }

  const options = conversionOptions[fileType] || []

  return (
    <div className="conversion-options">
      <div className="file-info">
        <FileText size={48} className="file-icon" />
        <div>
          <h3>{file.name}</h3>
          <p>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
        </div>
      </div>

      <div className="ai-toggles">
        <h3><Sparkles size={20} /> AI Features</h3>
        <div className="ai-options">
          {(fileType === 'image' || fileType === 'pdf') && (
            <label className="ai-toggle">
              <input 
                type="checkbox"
                checked={aiFeatures.ocr}
                onChange={(e) => setAiFeatures({ ...aiFeatures, ocr: e.target.checked })}
              />
              <span>🔍 Smart OCR (Extract Text)</span>
            </label>
          )}
          
          {fileType === 'image' && (
            <label className="ai-toggle">
              <input 
                type="checkbox"
                checked={aiFeatures.enhance}
                onChange={(e) => setAiFeatures({ ...aiFeatures, enhance: e.target.checked })}
              />
              <span>✨ AI Enhancement (Upscale & Improve)</span>
            </label>
          )}

          {(fileType === 'pdf' || fileType === 'document') && (
            <label className="ai-toggle">
              <input 
                type="checkbox"
                checked={aiFeatures.summarize}
                onChange={(e) => setAiFeatures({ ...aiFeatures, summarize: e.target.checked })}
              />
              <span>📝 AI Summarization</span>
            </label>
          )}

          <label className="ai-toggle">
            <input 
              type="checkbox"
              checked={aiFeatures.smartCompress}
              onChange={(e) => setAiFeatures({ ...aiFeatures, smartCompress: e.target.checked })}
            />
            <span>🗜️ Smart Compression (AI Optimized)</span>
          </label>
        </div>
      </div>

      <h3>Convert to:</h3>
      <div className="format-options">
        {options.map((option) => {
          const Icon = option.icon
          return (
            <button
              key={option.format}
              className={`format-option ${selectedFormat === option.format ? 'selected' : ''}`}
              onClick={() => setSelectedFormat(option.format)}
            >
              <Icon size={32} />
              <span>{option.label}</span>
            </button>
          )
        })}
        
        <button
          className={`format-option ${selectedFormat === 'compress' ? 'selected' : ''}`}
          onClick={() => setSelectedFormat('compress')}
        >
          <Package size={32} />
          <span>Compress</span>
        </button>
      </div>

      <div className="action-buttons">
        <button className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button 
          className="btn-primary"
          onClick={() => onConvert(selectedFormat)}
          disabled={!selectedFormat || isConverting}
        >
          {isConverting ? (
            <>
              <span className="spinner"></span>
              Converting...
            </>
          ) : (
            <>
              <Wand2 size={20} />
              Convert with AI
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default ConversionOptions

