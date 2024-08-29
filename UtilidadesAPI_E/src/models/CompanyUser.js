const { DataTypes } = require('sequelize');
const sequelize = require('../config/database').sequelize;

const CompanyUser = sequelize.define('company_users', {
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
  companymemberships: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: ''
  },
  email: {
    type: DataTypes.STRING(128),
    allowNull: false,
    defaultValue: ''
  },
  isblocked: {
    type: DataTypes.INTEGER
  },
  languagecode: {
    type: DataTypes.STRING(128),
    allowNull: false,
    defaultValue: ''
  },
  name: {
    type: DataTypes.STRING(128),
    allowNull: false,
    defaultValue: ''
  },
  systemmemberships: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: ''
  },
  telephone: {
    type: DataTypes.STRING(128),
    allowNull: false,
    defaultValue: ''
  },
  timezone: {
    type: DataTypes.STRING(128),
    allowNull: false,
    defaultValue: ''
  },
  virtualoperatormemberships: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: ''
  }
  // Otros campos...
}, {
  tableName: 'company_users',
  timestamps: false, // Desactiva los timestamps
});

/* CompanyUser.associate = models => {
    CompanyUser.belongsTo(models.Company, {
    foreignKey: 'id_company',
    as: 'company'
  });
}; */

module.exports = CompanyUser;