const { DataTypes } = require('sequelize');
const sequelize = require('../config/database').sequelize;

const CompanyDataCreation = sequelize.define('company_datacreation', {
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
  date_creation: {
    type: DataTypes.DATE
  },
  documentsuport_included: {
    type: DataTypes.BOOLEAN
  },
  payrroll_included: {
    type: DataTypes.BOOLEAN
  },
  reception_salesinvoice_included: {
    type: DataTypes.BOOLEAN
  },
  salesinvoice_included: {
    type: DataTypes.BOOLEAN
  },
  equivalentdocumentincluded: {
    type: DataTypes.BOOLEAN
  }
  // Otros campos...
}, {
  tableName: 'company_datacreation',
  timestamps: false, // Desactiva los timestamps
});

/* CompanyDataCreation.associate = models => {
    CompanyDataCreation.belongsTo(models.Company, {
    foreignKey: 'id_company',
    as: 'company'
  });
}; */

module.exports = CompanyDataCreation;