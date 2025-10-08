import { X, Clock, Trash2 } from 'lucide-react'

function ConversionHistory({ history, onClose, onClear }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`
    return date.toLocaleDateString()
  }

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content history-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="modal-header">
          <Clock size={32} />
          <h2>Conversion History</h2>
          <p className="modal-subtitle">Your recent conversions</p>
        </div>

        {history.length === 0 ? (
          <div className="empty-state">
            <Clock size={64} />
            <p>No conversion history yet</p>
            <p className="empty-state-subtitle">Start converting files to see your history here</p>
          </div>
        ) : (
          <>
            <div className="history-list">
              {history.map((item) => (
                <div key={item.id} className="history-item">
                  <div className="history-icon">
                    <span className="format-badge">{item.from}</span>
                    <span className="arrow">→</span>
                    <span className="format-badge">{item.to}</span>
                  </div>
                  <div className="history-info">
                    <div className="history-meta">
                      <span>{formatDate(item.date)}</span>
                      <span>•</span>
                      <span>{formatSize(item.size)}</span>
                      {item.count > 1 && (
                        <>
                          <span>•</span>
                          <span>{item.count} files</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="btn-outline btn-danger" onClick={onClear}>
              <Trash2 size={20} />
              Clear History
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default ConversionHistory


