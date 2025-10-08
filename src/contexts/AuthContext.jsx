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

  // Sign in function
  const signIn = async (email, password) => {
    try {
      setIsLoading(true)
      
      // Simulate API call - replace with real backend
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock user data - replace with real API response
      const userData = {
        id: '1',
        email: email,
        name: email.split('@')[0],
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        plan: 'free', // or 'premium'
        conversionsUsed: 0,
        conversionsLimit: 100, // Sign in yapan kullanıcıya 100 conversion hakkı
        joinedAt: new Date().toISOString()
      }

      setUser(userData)
      setIsPremium(userData.plan === 'premium')
      
      // Save to localStorage
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
      
      // Simulate API call - replace with real backend
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock user data - replace with real API response
      const userData = {
        id: Date.now().toString(),
        email: email,
        name: name,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
        plan: 'free',
        conversionsUsed: 0,
        conversionsLimit: 100, // Sign up yapan kullanıcıya da 100 conversion hakkı
        joinedAt: new Date().toISOString()
      }

      setUser(userData)
      setIsPremium(false)
      
      // Save to localStorage
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

  // Sign out function
  const signOut = () => {
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
    if (!user || isPremium) return -1
    return Math.max(0, user.conversionsLimit - user.conversionsUsed)
  }

  const value = {
    user,
    isLoading,
    isPremium,
    signIn,
    signUp,
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
