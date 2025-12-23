import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileImage, FileText, Film, Music, Files } from 'lucide-react'

function FileUpload({ onFileUpload, batchMode = false }) {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      if (batchMode) {
        onFileUpload(acceptedFiles.slice(0, 10)) // Max 10 files
      } else {
        onFileUpload([acceptedFiles[0]])
      }
    }
  }, [onFileUpload, batchMode])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: batchMode,
    maxSize: 100 * 1024 * 1024, // 100MB
  })

  return (
    <div className="upload-section">
      <div className="upload-trust-badge">
        <span className="trust-icon">🔒</span>
        <span className="trust-text">Files are processed locally in your browser. Never uploaded to servers.</span>
      </div>
      
      <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''} ${batchMode ? 'batch-mode' : ''}`}>
        <input {...getInputProps()} />
        {batchMode ? <Files size={56} className="upload-icon" /> : <Upload size={56} className="upload-icon" />}
        {isDragActive ? (
          <p className="upload-text">Drop your {batchMode ? 'files' : 'file'} here...</p>
        ) : (
          <>
            <p className="upload-text">
              {batchMode ? 'Drag & drop multiple files' : 'Drag & drop your file here'}
            </p>
            <p className="upload-subtext">
              or click to browse {batchMode && '(up to 10 files)'}
            </p>
            <p className="upload-limit">Max file size: 100MB per file • Auto-deleted after download</p>
          </>
        )}
      </div>

      <div className="supported-formats">
        <h3>⚡ Supported Formats</h3>
        <div className="format-grid">
          <div className="format-card">
            <FileText size={32} />
            <h4>Documents</h4>
            <p>PDF, Word, Excel, PowerPoint, TXT</p>
          </div>
          <div className="format-card">
            <FileImage size={32} />
            <h4>Images</h4>
            <p>JPG, PNG, WebP, HEIC, GIF, SVG, BMP</p>
          </div>
          <div className="format-card">
            <Film size={32} />
            <h4>Videos</h4>
            <p>MP4, WebM, AVI, MOV, MKV</p>
          </div>
          <div className="format-card">
            <Music size={32} />
            <h4>Audio</h4>
            <p>MP3, WAV, OGG, M4A, FLAC</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FileUpload
