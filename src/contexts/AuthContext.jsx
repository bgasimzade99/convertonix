import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPremium, setIsPremium] = useState(false)

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const savedUser = localStorage.getItem('convertonix_user')
        const savedPremium = localStorage.getItem('convertonix_premium') === 'true'
        
        if (savedUser) {
          setUser(JSON.parse(savedUser))
        }
        setIsPremium(savedPremium)
      } catch (error) {
        console.error('Error loading user:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  // Load Google Identity Services
  useEffect(() => {
    if (document.querySelector('script[src*="accounts.google.com"]')) {
      return // Already loaded
    }

    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    document.head.appendChild(script)
  }, [])

  // Load Facebook SDK
  useEffect(() => {
    if (document.querySelector('script[src*="connect.facebook.net"]')) {
      return // Already loaded
    }

    window.fbAsyncInit = function() {
      if (window.FB) {
        window.FB.init({
          appId: 'YOUR_FACEBOOK_APP_ID', // Replace with your Facebook App ID from https://developers.facebook.com/
          cookie: true,
          xfbml: true,
          version: 'v18.0'
        })
      }
    }

    const script = document.createElement('script')
    script.src = 'https://connect.facebook.net/en_US/sdk.js'
    script.async = true
    script.defer = true
    script.id = 'facebook-jssdk'
    document.head.appendChild(script)
  }, [])

  // Sign in function
  const signIn = async (email, password) => {
    try {
      setIsLoading(true)
      
      // Simulate API call - replace with real backend
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const userData = {
        id: '1',
        email: email,
        name: email.split('@')[0],
        nickname: email.split('@')[0],
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        avatarStyle: 'avataaars',
        avatarSeed: email.split('@')[0],
        plan: 'free',
        conversionsUsed: 0,
        conversionsLimit: 100,
        joinedAt: new Date().toISOString()
      }

      setUser(userData)
      setIsPremium(userData.plan === 'premium')
      
      localStorage.setItem('convertonix_user', JSON.stringify(userData))
      localStorage.setItem('convertonix_premium', userData.plan === 'premium')
      
      return { success: true, user: userData }
    } catch (error) {
      console.error('Sign in error:', error)
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  // Sign up function
  const signUp = async (email, password, name) => {
    try {
      setIsLoading(true)
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const userData = {
        id: Date.now().toString(),
        email: email,
        name: name,
        nickname: name,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
        avatarStyle: 'avataaars',
        avatarSeed: name,
        plan: 'free',
        conversionsUsed: 0,
        conversionsLimit: 100,
        joinedAt: new Date().toISOString()
      }

      setUser(userData)
      setIsPremium(false)
      
      localStorage.setItem('convertonix_user', JSON.stringify(userData))
      localStorage.setItem('convertonix_premium', 'false')
      
      return { success: true, user: userData }
    } catch (error) {
      console.error('Sign up error:', error)
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  // Sign in with Google - REAL implementation using Google Identity Services
  const signInWithGoogle = async () => {
    return new Promise((resolve) => {
      // Wait for Google SDK to load
      const checkGoogle = setInterval(() => {
        if (window.google && window.google.accounts) {
          clearInterval(checkGoogle)
          initializeGoogleSignIn(resolve)
        }
      }, 100)

      // Timeout after 5 seconds
      setTimeout(() => {
        clearInterval(checkGoogle)
        if (!window.google || !window.google.accounts) {
          resolve({ success: false, error: 'Google Sign-In is loading. Please wait a moment and try again.' })
        }
      }, 5000)
    })
  }

  const initializeGoogleSignIn = (resolve) => {
    try {
      const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID'
      
      // Use OAuth 2.0 popup flow for sign-in
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'email profile',
        callback: (tokenResponse) => {
          if (tokenResponse.error) {
            resolve({ success: false, error: tokenResponse.error })
            return
          }

          // Fetch user info from Google API
          fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenResponse.access_token}`)
            .then(res => {
              if (!res.ok) {
                throw new Error('Failed to fetch user info')
              }
              return res.json()
            })
            .then(data => {
              const userData = {
                id: data.id || Date.now().toString(),
                email: data.email,
                name: data.name || data.email.split('@')[0],
                nickname: data.name || data.email.split('@')[0],
                avatar: data.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.email}`,
                avatarStyle: 'avataaars',
                avatarSeed: data.email.split('@')[0],
                plan: 'free',
                conversionsUsed: 0,
                conversionsLimit: 100,
                provider: 'google',
                joinedAt: new Date().toISOString()
              }

              setUser(userData)
              setIsPremium(false)
              
              localStorage.setItem('convertonix_user', JSON.stringify(userData))
              localStorage.setItem('convertonix_premium', 'false')
              
              resolve({ success: true, user: userData })
            })
            .catch(err => {
              console.error('Google API error:', err)
              resolve({ success: false, error: 'Failed to fetch user information. Please try again.' })
            })
        }
      })

      // Request access token (this opens Google sign-in popup)
      tokenClient.requestAccessToken({ prompt: 'consent' })
    } catch (error) {
      console.error('Google sign-in initialization error:', error)
      resolve({ success: false, error: 'Failed to initialize Google sign-in. Please refresh and try again.' })
    }
  }

  // Sign in with Facebook - REAL implementation
  const signInWithFacebook = async () => {
    return new Promise((resolve) => {
      // Wait for Facebook SDK to load
      const checkFB = setInterval(() => {
        if (window.FB) {
          clearInterval(checkFB)
          initializeFacebookSignIn(resolve)
        }
      }, 100)

      // Timeout after 5 seconds
      setTimeout(() => {
        clearInterval(checkFB)
        if (!window.FB) {
          resolve({ success: false, error: 'Facebook SDK is loading. Please wait a moment and try again.' })
        }
      }, 5000)
    })
  }

  const initializeFacebookSignIn = (resolve) => {
    try {
      window.FB.login((response) => {
        if (response.authResponse) {
          window.FB.api('/me', { fields: 'name,email,picture' }, (userInfo) => {
            if (userInfo.error) {
              resolve({ success: false, error: userInfo.error.message || 'Failed to fetch user information.' })
              return
            }

            try {
              const userData = {
                id: userInfo.id || Date.now().toString(),
                email: userInfo.email || `${userInfo.id}@facebook.com`,
                name: userInfo.name || 'Facebook User',
                nickname: userInfo.name || 'Facebook User',
                avatar: userInfo.picture?.data?.url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userInfo.id}`,
                avatarStyle: 'avataaars',
                avatarSeed: userInfo.id,
                plan: 'free',
                conversionsUsed: 0,
                conversionsLimit: 100,
                provider: 'facebook',
                joinedAt: new Date().toISOString()
              }

              setUser(userData)
              setIsPremium(false)
              
              localStorage.setItem('convertonix_user', JSON.stringify(userData))
              localStorage.setItem('convertonix_premium', 'false')
              
              resolve({ success: true, user: userData })
            } catch (error) {
              console.error('Facebook user data error:', error)
              resolve({ success: false, error: 'Failed to process Facebook sign-in. Please try again.' })
            }
          })
        } else {
          if (response.status === 'not_authorized') {
            resolve({ success: false, error: 'Facebook login was cancelled.' })
          } else {
            resolve({ success: false, error: 'Facebook login failed. Please try again.' })
          }
        }
      }, { scope: 'email,public_profile' })
    } catch (error) {
      console.error('Facebook sign-in error:', error)
      resolve({ success: false, error: 'Failed to initialize Facebook sign-in. Please refresh and try again.' })
    }
  }

  // Update user function
  const updateUser = async (updates) => {
    try {
      if (!user) {
        return { success: false, error: 'No user logged in' }
      }

      setIsLoading(true)
      
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const updatedUser = {
        ...user,
        ...updates
      }

      setUser(updatedUser)
      
      localStorage.setItem('convertonix_user', JSON.stringify(updatedUser))
      
      return { success: true, user: updatedUser }
    } catch (error) {
      console.error('Update user error:', error)
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  // Sign out function
  const signOut = () => {
    // Sign out from Google if logged in with Google
    if (window.google && window.google.accounts && user?.provider === 'google') {
      window.google.accounts.id.disableAutoSelect()
    }
    
    // Sign out from Facebook if logged in with Facebook
    if (window.FB && user?.provider === 'facebook') {
      window.FB.logout(() => {})
    }

    setUser(null)
    setIsPremium(false)
    localStorage.removeItem('convertonix_user')
    localStorage.removeItem('convertonix_premium')
    localStorage.removeItem('conversionHistory')
  }

  // Upgrade to premium
  const upgradeToPremium = () => {
    if (user) {
      const updatedUser = { ...user, plan: 'premium', conversionsLimit: -1 }
      setUser(updatedUser)
      setIsPremium(true)
      localStorage.setItem('convertonix_user', JSON.stringify(updatedUser))
      localStorage.setItem('convertonix_premium', 'true')
    }
  }

  // Track conversion usage
  const trackConversion = () => {
    if (user && user.plan === 'free') {
      const updatedUser = { ...user, conversionsUsed: user.conversionsUsed + 1 }
      setUser(updatedUser)
      localStorage.setItem('convertonix_user', JSON.stringify(updatedUser))
    }
  }

  // Check if user can convert (free tier limit)
  const canConvert = () => {
    if (!user || isPremium) return true
    return user.conversionsUsed < user.conversionsLimit
  }

  // Get remaining conversions
  const getRemainingConversions = () => {
    if (!user) {
      const stored = localStorage.getItem('remainingConversions')
      return stored ? parseInt(stored, 10) : 5
    }
    if (isPremium) return -1
    return Math.max(0, user.conversionsLimit - user.conversionsUsed)
  }

  const value = {
    user,
    isLoading,
    isPremium,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithFacebook,
    updateUser,
    signOut,
    upgradeToPremium,
    trackConversion,
    canConvert,
    getRemainingConversions
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
