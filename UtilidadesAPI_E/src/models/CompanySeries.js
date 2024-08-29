const { DataTypes } = require('sequelize');
const sequelize = require('../config/database').sequelize;

const CompanySeries = sequelize.define('company_series', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  id_company: {
    type: DataTypes.INTEGER,
    references: {
      model: 'company',
      key: 'id'
    }
  },
  authorizationnumber: {
    type: DataTypes.STRING(128),
    allowNull: false,
    defaultValue: ''
  },
  efectivevalue: {
    type: DataTypes.STRING(128),
    allowNull: false,
    defaultValue: ''
  },
  endvalue: {
    type: DataTypes.INTEGER
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: ''
  },
  prefix: {
    type: DataTypes.STRING(128),
    allowNull: false,
    defaultValue: ''
  },
  startvalue: {
    type: DataTypes.INTEGER
  },
  technicalkey: {
    type: DataTypes.STRING(128),
    allowNull: false,
    defaultValue: ''
  },
  testsetid: {
    type: DataTypes.STRING(128),
    allowNull: false,
    defaultValue: ''
  },
  validfrom: {
    type: DataTypes.DATE
  },
  validto: {
    type: DataTypes.DATE
  },
  // Otros campos...
}, {
  tableName: 'company_series',
  timestamps: false, // Desactiva los timestamps
});

/* CompanySeries.associate = models => {
    CompanySeries.belongsTo(models.Company, {
    foreignKey: 'id_company',
    as: 'company'
  });
}; */

module.exports = CompanySeries;