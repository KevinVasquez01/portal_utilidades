const { DataTypes } = require('sequelize');
const sequelize = require('../config/database').sequelize;

const CompanyResponsibility = sequelize.define('company_responsibilities', {
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
  responsabilitytypes: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: ''
  }
  // Otros campos...
}, {
  tableName: 'company_responsibilities',
  timestamps: false, // Desactiva los timestamps
});

/* CompanyResponsibility.associate = models => {
    CompanyResponsibility.belongsTo(models.Company, {
    foreignKey: 'id_company',
    as: 'company'
  });
}; */

module.exports = CompanyResponsibility;