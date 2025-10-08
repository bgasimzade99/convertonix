import { Zap, Package, Image, FileText, Settings, GitCompare, Sparkles } from 'lucide-react'

function QuickActions({ onAction, onToggleBatch, batchMode, onShowAdvanced, onShowAIChat }) {
  return (
        <div className="quick-actions">
          <h3 className="quick-actions-title">⚡ Quick Actions</h3>
      <div className="quick-actions-grid">
        <button 
          className="quick-action-btn ai-generate-btn"
          onClick={onShowAIChat}
          title="Generate files with AI"
        >
          <Sparkles size={24} />
          <span>AI Generate</span>
        </button>
        
        <button 
          className="quick-action-btn"
          onClick={() => onAction('compress')}
          title="Compress any file"
        >
          <Package size={24} />
          <span>Compress</span>
        </button>
        
        <button 
          className="quick-action-btn"
          onClick={() => onAction('pdf')}
          title="Convert to PDF"
        >
          <FileText size={24} />
          <span>To PDF</span>
        </button>
        
        <button 
          className="quick-action-btn"
          onClick={() => onAction('jpg')}
          title="Convert to JPG"
        >
          <Image size={24} />
          <span>To JPG</span>
        </button>
        
        <button 
          className="quick-action-btn"
          onClick={() => onAction('png')}
          title="Convert to PNG"
        >
          <Image size={24} />
          <span>To PNG</span>
        </button>
        
        <button 
          className={`quick-action-btn ${batchMode ? 'active' : ''}`}
          onClick={onToggleBatch}
          title="Toggle batch mode"
        >
          <GitCompare size={24} />
          <span>{batchMode ? 'Single' : 'Batch'}</span>
        </button>
        
        <button 
          className="quick-action-btn"
          onClick={onShowAdvanced}
          title="Advanced settings"
        >
          <Settings size={24} />
          <span>Settings</span>
        </button>
      </div>
    </div>
  )
}

export default QuickActions

