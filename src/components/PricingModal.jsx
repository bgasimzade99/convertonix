import { X, Check, Crown, Zap, Gift } from 'lucide-react'

function PricingModal({ onClose, onPurchase }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        {/* Special Gift Banner */}
        <div className="special-gift-banner">
          <Gift size={16} />
          <span>Special Gift for New Users!</span>
        </div>

        <h2>Get <span className="highlight-green">100 FREE</span> Conversions in Your First Month!</h2>
        <p className="modal-subtitle">
          Sign up now and get <strong>100 conversions total for your first month!</strong> 
          Perfect for trying all features and experiencing our platform fully.
        </p>

        <div className="pricing-cards">
          <div className="pricing-card">
            <div className="pricing-icon">
              <Zap size={32} />
            </div>
            <h3>Free</h3>
            <div className="price">$0</div>
            <ul className="features">
              <li><Check size={16} /> 100 conversions first month</li>
              <li><Check size={16} /> All formats included</li>
              <li><Check size={16} /> <span className="highlight-purple">All AI Features</span></li>
            </ul>
            <button className="btn-outline" onClick={onClose}>
              Current Plan
            </button>
          </div>

          <div className="pricing-card featured">
            <div className="popular-badge">MOST POPULAR</div>
            <div className="pricing-icon">
              <Crown size={32} />
            </div>
            <h3>Premium</h3>
            <div className="price">
              $4.99<span>/month</span>
            </div>
            <ul className="features">
              <li><Check size={16} /> Unlimited conversions</li>
              <li><Check size={16} /> All formats supported</li>
              <li><Check size={16} /> Advanced AI features</li>
              <li><Check size={16} /> Priority processing</li>
              <li><Check size={16} /> Batch conversions</li>
              <li><Check size={16} /> No watermarks</li>
            </ul>
            <button className="btn-primary" onClick={() => onPurchase('premium')}>
              Upgrade to Premium
            </button>
          </div>

          <div className="pricing-card">
            <div className="pricing-icon">
              <Zap size={32} />
            </div>
            <h3>Pay as You Go</h3>
            <div className="price">
              $0.99<span>/conversion</span>
            </div>
            <ul className="features">
              <li><Check size={16} /> One-time purchase</li>
              <li><Check size={16} /> No subscription</li>
              <li><Check size={16} /> All features included</li>
              <li><Check size={16} /> Perfect for occasional use</li>
            </ul>
            <button className="btn-outline" onClick={() => onPurchase('onetime')}>
              Buy One Conversion
            </button>
          </div>
        </div>

        <div className="success-status">
          <Check size={16} />
          <span>You're already signed in and enjoying your free access!</span>
        </div>

        <p className="pricing-note">
          💳 Secure payment powered by Stripe. Cancel anytime.
        </p>
      </div>
    </div>
  )
}

export default PricingModal

