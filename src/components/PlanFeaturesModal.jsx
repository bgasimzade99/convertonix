import React from 'react'
import { X, Check } from 'lucide-react'

function PlanFeaturesModal({ plan, isOpen, onClose }) {
  if (!isOpen || !plan) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content plan-features-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="features-modal-header">
          <div className="features-modal-icon">{plan.icon}</div>
          <div>
            <h2 className="features-modal-title">{plan.name}</h2>
            {plan.tagline && (
              <p className="features-modal-tagline">{plan.tagline}</p>
            )}
          </div>
        </div>

        <div className="features-modal-content">
          <h3 className="features-section-title">What's included</h3>
          <ul className="features-modal-list">
            {plan.features.map((feature, idx) => (
              <li key={idx} className={feature.highlight ? 'feature-highlight' : ''}>
                <Check size={20} className="check-icon" />
                <span>{feature.text}</span>
              </li>
            ))}
          </ul>

          {plan.limitations && plan.limitations.length > 0 && (
            <>
              <h3 className="features-section-title limitations-title">Limitations</h3>
              <ul className="features-modal-list limitations-list">
                {plan.limitations.map((limitation, idx) => (
                  <li key={idx}>
                    <span>{limitation}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div className="features-modal-footer">
          <button 
            className="btn-primary features-modal-cta"
            onClick={() => {
              onClose()
              // Trigger the plan's action
              if (plan.id === 'free') {
                window.location.href = '/'
              } else if (plan.id === 'enterprise') {
                // Handle contact sales
              } else {
                // Handle upgrade
              }
            }}
          >
            {plan.buttonText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PlanFeaturesModal

