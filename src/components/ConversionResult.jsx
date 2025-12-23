import { Download, RotateCcw, CheckCircle } from 'lucide-react'
import { saveAs } from 'file-saver'

function ConversionResult({ originalFile, convertedFile, format, onReset }) {
  const handleDownload = () => {
    saveAs(convertedFile.blob, convertedFile.filename)
  }

  const originalSize = (originalFile.size / 1024 / 1024).toFixed(2)
  const convertedSize = (convertedFile.blob.size / 1024 / 1024).toFixed(2)
  const savings = ((1 - convertedFile.blob.size / originalFile.size) * 100).toFixed(1)

  return (
    <div className="conversion-result">
      <div className="success-icon">
        <CheckCircle size={64} />
        <div className="success-particles">
          <span className="particle"></span>
          <span className="particle"></span>
          <span className="particle"></span>
          <span className="particle"></span>
          <span className="particle"></span>
          <span className="particle"></span>
          <span className="particle"></span>
          <span className="particle"></span>
        </div>
      </div>
      
      <h2>Conversion Complete! 🎉</h2>
      
      <div className="result-info">
        <div className="size-comparison">
          <div className="size-item">
            <span className="size-label">Original</span>
            <span className="size-value">{originalSize} MB</span>
          </div>
          <div className="size-arrow">→</div>
          <div className="size-item">
            <span className="size-label">Converted</span>
            <span className="size-value">{convertedSize} MB</span>
          </div>
        </div>
        
        {savings > 0 && (
          <p className="savings">
            💾 Saved {savings}% in file size
          </p>
        )}

        {convertedFile.aiResults && (
          <div className="ai-results">
            <h3>AI Analysis Results</h3>
            
            {convertedFile.aiResults.ocr && (
              <div className="ai-result-item">
                <h4>📄 Extracted Text:</h4>
                <div className="ocr-text">{convertedFile.aiResults.ocr}</div>
              </div>
            )}

            {convertedFile.aiResults.summary && (
              <div className="ai-result-item">
                <h4>📝 AI Summary:</h4>
                <p>{convertedFile.aiResults.summary}</p>
              </div>
            )}

            {convertedFile.aiResults.enhanced && (
              <div className="ai-result-item">
                <h4>✨ AI Enhancement Applied</h4>
                <p>Image quality improved with AI upscaling</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="result-actions">
        <button className="btn-primary" onClick={handleDownload}>
          <Download size={20} />
          Download File
        </button>
        <button className="btn-secondary" onClick={onReset}>
          <RotateCcw size={20} />
          Convert Another
        </button>
      </div>
    </div>
  )
}

export default ConversionResult

