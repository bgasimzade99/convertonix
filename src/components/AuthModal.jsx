import { useState } from 'react'
import { X, Mail, Lock, User, Eye, EyeOff, Sparkles, Crown } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

function AuthModal({ isOpen, onClose }) {
  const [mode, setMode] = useState('signin') // 'signin' or 'signup'
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const { signIn, signUp } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      let result
      if (mode === 'signin') {
        result = await signIn(formData.email, formData.password)
      } else {
        result = await signUp(formData.email, formData.password, formData.name)
      }

      if (result.success) {
        onClose()
        setFormData({ email: '', password: '', name: '' })
      } else {
        setError(result.error || 'Something went wrong')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin')
    setError('')
    setFormData({ email: '', password: '', name: '' })
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="auth-header">
          <div className="auth-logo">
            <Sparkles size={48} className="logo-icon" />
            <h2>Welcome to Convertonix</h2>
          </div>
          <p className="auth-subtitle">
            {mode === 'signin' 
              ? '🎯 Sign in to access your premium features' 
              : '⚡ Create your account and start converting files'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'signup' && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <div className="input-group">
                <User size={20} className="input-icon" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required={mode === 'signup'}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-group">
              <Mail size={20} className="input-icon" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-group">
              <Lock size={20} className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                required
                minLength={6}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="error-message">
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="btn-primary auth-submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="spinner"></div>
            ) : (
              <>
                {mode === 'signin' ? 'Sign In' : 'Create Account'}
                {mode === 'signup' && <Sparkles size={20} />}
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {mode === 'signin' ? "Don't have an account?" : "Already have an account?"}
            <button
              type="button"
              className="auth-toggle"
              onClick={toggleMode}
            >
              {mode === 'signin' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>

        <div className="auth-benefits">
          <h3>💎 What you get:</h3>
          <div className="benefits-list">
            <div className="benefit-item">
              <Crown size={20} />
              <span>Free tier: 2 conversions/day</span>
            </div>
            <div className="benefit-item">
              <Sparkles size={20} />
              <span>AI-powered features</span>
            </div>
            <div className="benefit-item">
              <span>🔄</span>
              <span>Cross-device sync</span>
            </div>
            <div className="benefit-item">
              <span>🛡️</span>
              <span>Privacy-first processing</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthModal
