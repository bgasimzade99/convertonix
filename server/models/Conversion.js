import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

const Conversion = sequelize.define('Conversion', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true, // null for anonymous users
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  sourceFormat: {
    type: DataTypes.STRING,
    allowNull: false
  },
  targetFormat: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fileName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fileSize: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  outputSize: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  aiFeatures: {
    type: DataTypes.JSON,
    defaultValue: {}
  },
  processingTime: {
    type: DataTypes.INTEGER, // in milliseconds
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed'),
    defaultValue: 'pending'
  },
  error: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  ipAddress: {
    type: DataTypes.STRING,
    allowNull: true
  },
  userAgent: {
    type: DataTypes.STRING,
    allowNull: true
  }
})

export default Conversion

