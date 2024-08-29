const { DataTypes } = require('sequelize');
const sequelize = require('../config/database').sequelize;

const Transaction = sequelize.define('transactions', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  company_document: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: ''
  },
  date: {
    type: DataTypes.DATE
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: ''
  },
  transaction_type: {
    type: DataTypes.INTEGER
  },
  user: {
    type: DataTypes.STRING(256),
    allowNull: false,
    defaultValue: ''
  }
  // Otros campos...
}, {
  tableName: 'transactions',
  timestamps: false, // Desactiva los timestamps
});


module.exports = Transaction;