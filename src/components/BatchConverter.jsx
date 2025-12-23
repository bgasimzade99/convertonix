import { FileText, Wand2, X } from 'lucide-react'

function BatchConverter({ files, onConvert, isConverting, aiFeatures, setAiFeatures, onCancel }) {
  const handleConvert = (format) => {
    onConvert(format)
  }

  const totalSize = files.reduce((sum, file) => sum + file.size, 0)
  const formatSize = (bytes) => {
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div className="batch-converter">
      <div className="batch-header">
        <h2>📦 Batch Conversion</h2>
        <p>{files.length} files selected • Total: {formatSize(totalSize)}</p>
      </div>

      <div className="batch-files-list">
        {files.map((file, index) => (
          <div key={index} className="batch-file-item">
            <FileText size={20} />
            <span className="file-name">{file.name}</span>
            <span className="file-size">{formatSize(file.size)}</span>
          </div>
        ))}
      </div>

      <div className="batch-options">
        <h3>Convert all to:</h3>
        <div className="format-options-compact">
          {['jpg', 'png', 'webp', 'pdf', 'compress'].map((format) => (
            <button
              key={format}
              className="format-btn"
              onClick={() => handleConvert(format)}
              disabled={isConverting}
            >
              {format.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="action-buttons">
        <button className="btn-secondary" onClick={onCancel}>
          <X size={20} />
          Cancel
        </button>
        <button 
          className="btn-primary"
          disabled={isConverting}
        >
          {isConverting ? (
            <>
              <span className="spinner"></span>
              <span>AI Processing {files.length} files<span className="ai-loading-dots"><span></span><span></span><span></span></span></span>
            </>
          ) : (
            <>
              <Wand2 size={20} />
              Convert All
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default BatchConverter


