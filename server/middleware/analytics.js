import Conversion from '../models/Conversion.js'

export async function trackConversion(req, res, next) {
  const startTime = Date.now()
  
  // Store original send
  const originalSend = res.send
  
  res.send = async function(data) {
    const processingTime = Date.now() - startTime
    
    try {
      // Track conversion in database
      await Conversion.create({
        userId: req.user?.id || null,
        sourceFormat: req.body?.sourceFormat || 'unknown',
        targetFormat: req.body?.targetFormat || 'unknown',
        fileName: req.file?.originalname || 'unknown',
        fileSize: req.file?.size || 0,
        outputSize: data?.length || 0,
        aiFeatures: req.body?.aiFeatures || {},
        processingTime,
        status: res.statusCode === 200 ? 'completed' : 'failed',
        error: res.statusCode !== 200 ? data : null,
        ipAddress: req.ip,
        userAgent: req.get('user-agent')
      })
    } catch (error) {
      console.error('Analytics tracking error:', error)
    }
    
    originalSend.call(this, data)
  }
  
  next()
}

export async function getAnalytics(userId = null) {
  const where = userId ? { userId } : {}
  
  const [totalConversions, successfulConversions, avgProcessingTime] = await Promise.all([
    Conversion.count({ where }),
    Conversion.count({ where: { ...where, status: 'completed' } }),
    Conversion.findOne({
      where,
      attributes: [[sequelize.fn('AVG', sequelize.col('processingTime')), 'avgTime']]
    })
  ])
  
  const popularFormats = await Conversion.findAll({
    where,
    attributes: [
      'targetFormat',
      [sequelize.fn('COUNT', sequelize.col('targetFormat')), 'count']
    ],
    group: ['targetFormat'],
    order: [[sequelize.literal('count'), 'DESC']],
    limit: 10
  })
  
  return {
    totalConversions,
    successfulConversions,
    successRate: totalConversions > 0 ? (successfulConversions / totalConversions * 100).toFixed(2) : 0,
    avgProcessingTime: Math.round(avgProcessingTime?.dataValues.avgTime || 0),
    popularFormats
  }
}

