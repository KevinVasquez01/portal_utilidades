// models/company.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database').sequelize;

const Company = sequelize.define('company', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  checkdigit: {
    type: DataTypes.STRING(256),
    allowNull: false,
    defaultValue: ''
  },
  countrycode: {
    type: DataTypes.STRING(256),
    allowNull: false,
    defaultValue: ''
  },
  distributorid: {
    type: DataTypes.STRING(128),
    allowNull: false,
    defaultValue: ''
  },
  documentnumber: {
    type: DataTypes.STRING(256),
    allowNull: false,
    defaultValue: ''
  },
  documenttype: {
    type: DataTypes.STRING(256),
    allowNull: false,
    defaultValue: ''
  },
  familyname: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: ''
  },
  firstname: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: ''
  },
  languagecode: {
    type: DataTypes.STRING(256),
    allowNull: false,
    defaultValue: ''
  },
  legaltype: {
    type: DataTypes.STRING(256),
    allowNull: false,
    defaultValue: ''
  },
  middlename: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: ''
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: ''
  },
  namepackageorplan: {
    type: DataTypes.STRING(128),
    allowNull: false,
    defaultValue: ''
  },
  packdefault: {
    type: DataTypes.BOOLEAN
  },
  taxscheme: {
    type: DataTypes.STRING(256),
    allowNull: false,
    defaultValue: ''
  },
  timezonecode: {
    type: DataTypes.STRING(256),
    allowNull: false,
    defaultValue: ''
  },
  virtualoperator: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: ''
  }
  // Otros campos...
},{
  tableName: 'company', //Nombre tabla
  timestamps: false, // Desactiva los timestamps
});

/* Company.associate = models => {
  Company.hasMany(CompanyContact, {
    foreignKey: 'id_company',
    as: 'contacts'
  });
  Company.hasMany(CompanyResponsability, {
    foreignKey: 'id_company',
    as: 'responsabilities'
  });
  Company.hasMany(CompanyDataCreation, {
    foreignKey: 'id_company',
    as: 'dataCreations'
  });
  Company.hasMany(CompanySeries, {
    foreignKey: 'id_company',
    as: 'series'
  });
  Company.hasMany(CompanyUser, {
    foreignKey: 'id_company',
    as: 'users'
  });
  // Otras asociaciones...
}; */

module.exports = Company;
