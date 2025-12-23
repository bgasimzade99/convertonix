import { useState, useEffect } from 'react'
import { X, User, Save, Settings, Mail, Sparkles } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

// Avatar options - using dicebear API
const AVATAR_STYLES = [
  { name: 'Avataaars', value: 'avataaars' },
  { name: 'Bottts', value: 'bottts' },
  { name: 'Big Smile', value: 'big-smile' },
  { name: 'Pixel Art', value: 'pixel-art' },
  { name: 'Personas', value: 'personas' },
  { name: 'Adventurer', value: 'adventurer' },
  { name: 'Fun-emoji', value: 'fun-emoji' },
  { name: 'Lorelei', value: 'lorelei' }
]

function UserSettings({ isOpen, onClose }) {
  const { user, updateUser } = useAuth()
  const [nickname, setNickname] = useState(user?.name || '')
  const [avatarStyle, setAvatarStyle] = useState('avataaars')
  const [avatarSeed, setAvatarSeed] = useState(user?.email?.split('@')[0] || 'user')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (user) {
      setNickname(user.name || user.nickname || '')
      // Extract avatar style from current avatar URL if exists
      if (user.avatar) {
        const match = user.avatar.match(/dicebear\.com\/.*\/(.*)\//)
        if (match) {
          setAvatarStyle(match[1])
        }
      }
      setAvatarSeed(user.email?.split('@')[0] || user.avatarSeed || 'user')
    }
  }, [user])

  if (!isOpen || !user) return null

  const getAvatarUrl = (style, seed) => {
    return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`
  }

  const handleSave = async () => {
    if (!nickname.trim()) {
      setError('Nickname is required')
      return
    }

    setIsSaving(true)
    setError('')
    setSuccess('')

    try {
      const newAvatar = getAvatarUrl(avatarStyle, avatarSeed)
      const result = await updateUser({
        name: nickname.trim(),
        nickname: nickname.trim(),
        avatar: newAvatar,
        avatarStyle,
        avatarSeed
      })

      if (result.success) {
        setSuccess('Settings saved successfully!')
        setTimeout(() => {
          onClose()
        }, 1000)
      } else {
        setError(result.error || 'Failed to save settings')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsSaving(false)
    }
  }

  const handleAvatarSeedChange = (e) => {
    const newSeed = e.target.value || 'user'
    setAvatarSeed(newSeed)
  }

  const randomizeSeed = () => {
    setAvatarSeed(Math.random().toString(36).substring(2, 15))
  }

  const currentAvatarUrl = getAvatarUrl(avatarStyle, avatarSeed)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content premium-settings-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        {/* Premium Header */}
        <div className="premium-settings-header">
          <div className="premium-header-icon">
            <Settings size={32} />
          </div>
          <div className="premium-header-content">
            <h2>Settings</h2>
            <p>Manage your profile and preferences</p>
          </div>
        </div>

        <div className="premium-settings-body">
          {/* Avatar Section - Premium Design */}
          <div className="premium-section">
            <h3 className="premium-section-title">
              <span>Profile Avatar</span>
            </h3>
            
            <div className="premium-avatar-container">
              {/* Large Avatar Preview */}
              <div className="premium-avatar-preview">
                <div className="avatar-preview-frame">
                  <img 
                    src={currentAvatarUrl} 
                    alt="Your Avatar" 
                    className="premium-avatar-image"
                  />
                  <div className="avatar-preview-glow"></div>
                </div>
              </div>

              {/* Avatar Controls */}
              <div className="premium-avatar-controls">
                {/* Avatar Style Grid */}
                <div className="avatar-style-section">
                  <label className="premium-label">Avatar Style</label>
                  <div className="avatar-style-grid">
                    {AVATAR_STYLES.map(style => (
                      <div
                        key={style.value}
                        className={`avatar-style-option ${avatarStyle === style.value ? 'active' : ''}`}
                        onClick={() => setAvatarStyle(style.value)}
                        title={style.name}
                      >
                        <img
                          src={getAvatarUrl(style.value, avatarSeed)}
                          alt={style.name}
                        />
                        <span className="avatar-style-name">{style.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Avatar Seed Input */}
                <div className="premium-input-group">
                  <label className="premium-label" htmlFor="avatarSeed">
                    Customize Seed
                    <button 
                      type="button"
                      className="randomize-seed-btn"
                      onClick={randomizeSeed}
                      title="Randomize seed"
                    >
                      <Sparkles size={16} />
                    </button>
                  </label>
                  <div className="premium-input-wrapper">
                    <input
                      type="text"
                      id="avatarSeed"
                      value={avatarSeed}
                      onChange={handleAvatarSeedChange}
                      placeholder="Enter a unique name or word"
                      className="premium-input"
                    />
                  </div>
                  <span className="input-hint">Change this text to generate a different avatar</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Information Section */}
          <div className="premium-section">
            <h3 className="premium-section-title">
              <span>Profile Information</span>
            </h3>
            
            <div className="premium-form-grid">
              {/* Nickname */}
              <div className="premium-input-group">
                <label className="premium-label" htmlFor="nickname">
                  <User size={18} />
                  Display Name
                </label>
                <div className="premium-input-wrapper">
                  <input
                    type="text"
                    id="nickname"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="Enter your display name"
                    className="premium-input"
                    maxLength={50}
                  />
                </div>
                <span className="input-hint">This is how your name will appear</span>
              </div>

              {/* Email (Read-only) */}
              <div className="premium-input-group">
                <label className="premium-label">
                  <Mail size={18} />
                  Email Address
                </label>
                <div className="premium-input-wrapper">
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="premium-input disabled-input"
                  />
                </div>
                <span className="input-hint">Email cannot be changed</span>
              </div>
            </div>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="premium-error-message">
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="premium-success-message">
              <span>{success}</span>
            </div>
          )}
        </div>

        {/* Premium Footer */}
        <div className="premium-settings-footer">
          <button
            type="button"
            className="premium-btn-secondary"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            type="button"
            className="premium-btn-primary"
            onClick={handleSave}
            disabled={isSaving || !nickname.trim()}
          >
            {isSaving ? (
              <div className="spinner small"></div>
            ) : (
              <>
                <Save size={20} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserSettings
