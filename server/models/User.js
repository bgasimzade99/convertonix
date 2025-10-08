import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'
import bcrypt from 'bcrypt'

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true // null for OAuth users
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isPremium: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  subscriptionType: {
    type: DataTypes.ENUM('free', 'premium', 'onetime'),
    defaultValue: 'free'
  },
  subscriptionEndDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  stripeCustomerId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  usageCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  lastUsageReset: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  googleId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true
  },
  dropboxId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  verificationToken: {
    type: DataTypes.STRING,
    allowNull: true
  },
  resetPasswordToken: {
    type: DataTypes.STRING,
    allowNull: true
  },
  resetPasswordExpires: {
    type: DataTypes.DATE,
    allowNull: true
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(user.password, salt)
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password') && user.password) {
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(user.password, salt)
      }
    }
  }
})

User.prototype.comparePassword = async function(candidatePassword) {
  if (!this.password) return false
  return await bcrypt.compare(candidatePassword, this.password)
}

export default User

