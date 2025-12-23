import { useEffect } from 'react'
import { AlertCircle, CheckCircle, X } from 'lucide-react'

function Toast({ message, type = 'error', onClose, duration = 4000 }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const iconMap = {
    error: <AlertCircle size={20} />,
    success: <CheckCircle size={20} />,
    warning: <AlertCircle size={20} />
  }

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-icon">
        {iconMap[type]}
      </div>
      <div className="toast-message">{message}</div>
      <button className="toast-close" onClick={onClose}>
        <X size={18} />
      </button>
    </div>
  )
}

export default Toast
