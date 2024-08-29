const { DataTypes } = require('sequelize');
const sequelize = require('../config/database').sequelize;

const CompanyContact = sequelize.define('company_contact', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  addressline: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: ''
  },
  citycode: {
    type: DataTypes.STRING(128),
    allowNull: false,
    defaultValue: ''
  },
  country: {
    type: DataTypes.STRING(128),
    allowNull: false,
    defaultValue: ''
  },
  departmentcode: {
    type: DataTypes.STRING(128),
    allowNull: false,
    defaultValue: ''
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: ''
  },
  financialsupportemail: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: ''
  },
  id_company: {
    type: DataTypes.INTEGER,
    references: {
      model: 'company',
      key: 'id'
    }
  },
  postalcode: {
    type: DataTypes.STRING(128),
    allowNull: false,
    defaultValue: ''
  }
  // Otros campos...
}, {
  tableName: 'company_contact',
  timestamps: false, // Desactiva los timestamps
});

/* CompanyContact.associate = models => {
  CompanyContact.belongsTo(Company, {
    foreignKey: 'id_company',
    as: 'company'
  });
}; */

module.exports = CompanyContact;