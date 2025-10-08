import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'

dotenv.config()

// PostgreSQL with Sequelize (recommended for production)
export const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})

// Test connection
export async function testConnection() {
  try {
    await sequelize.authenticate()
    console.log('✅ Database connection established successfully.')
  } catch (error) {
    console.error('❌ Unable to connect to database:', error)
  }
}

// Sync models
export async function syncDatabase() {
  try {
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' })
    console.log('✅ Database synced successfully.')
  } catch (error) {
    console.error('❌ Database sync failed:', error)
  }
}

