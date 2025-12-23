// Campaign Configuration
// Toggle campaigns on/off easily by setting enabled: false

export const NEW_YEAR_CAMPAIGN = {
  enabled: true, // Set to false to disable campaign
  name: 'New Year Power Deal',
  startDate: '2024-01-01', // Campaign start date
  endDate: '2026-01-05', // Campaign ends January 5, 2026
  
  plan: {
    name: 'Pro – New Year Edition',
    tagline: 'Exclusive 2026 Access',
    price: 59, // One-time payment for the full year
    originalPrice: 96, // 12 months × $8 = $96 (for reference only, not shown as discount)
    duration: 'Full Year 2026',
    description: 'One payment. Full year. No monthly fees.',
    features: [
      { text: 'Unlimited conversions for all of 2026', highlight: true },
      { text: 'All 100+ formats', highlight: true },
      { text: 'Faster AI processing', highlight: true },
      { text: 'Priority queue', highlight: false },
      { text: 'Instant file deletion', highlight: false },
      { text: 'No ads', highlight: false },
      { text: 'Email support', highlight: false }
    ],
    buttonText: 'Get New Year Access',
    badge: 'EXCLUSIVE'
  },
  
  banner: {
    title: '🎆 New Year Power Deal',
    subtitle: 'Unlock unlimited conversions for all of 2026 with one payment',
    cta: 'See Offer'
  }
}

// Helper function to check if campaign is active
export const isCampaignActive = (campaign) => {
  if (!campaign.enabled) return false
  
  const now = new Date()
  const start = new Date(campaign.startDate)
  const end = new Date(campaign.endDate)
  
  return now >= start && now <= end
}

// Get days remaining in campaign
export const getDaysRemaining = (campaign) => {
  if (!isCampaignActive(campaign)) return 0
  
  const now = new Date()
  const end = new Date(campaign.endDate)
  const diffTime = end - now
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays > 0 ? diffDays : 0
}

