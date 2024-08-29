const sequelize = require('../config/database').sequelize;
const DataElement = require('./DataElement');
const Company = require('./Company');
const CompanyContact = require('./CompanyContact');
const CompanyDataCreation = require('./CompanyDataCreation');
const CompanyResponsability = require('./CompanyResponsibility');
const CompanySeries = require('./CompanySeries');
const CompanyUser = require('./CompanyUser');

// Importa otros modelos si los tienes

const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: false }); // `alter: true` para actualizar el esquema
    console.log('Database synced');
  } catch (error) {
    console.error('Unable to sync database:', error);
  }
};

// Asociaciones
Company.hasMany(CompanyContact, {
  foreignKey: 'id_company',
  as: 'contacts'
});
Company.hasMany(CompanyResponsability, {
  foreignKey: 'id_company',
  as: 'responsibilities'
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

// Pertenencias
CompanyContact.belongsTo(Company, {
  foreignKey: 'id_company',
  as: 'company'
});
CompanyDataCreation.belongsTo(Company, {
  foreignKey: 'id_company',
  as: 'company'
});
CompanyResponsability.belongsTo(Company, {
  foreignKey: 'id_company',
  as: 'company'
});
CompanySeries.belongsTo(Company, {
  foreignKey: 'id_company',
  as: 'company'
});
CompanyUser.belongsTo(Company, {
  foreignKey: 'id_company',
  as: 'company'
});


module.exports = {
  syncDatabase,
  DataElement,
  Company,
  CompanyContact,
  CompanyDataCreation,
  CompanyResponsability,
  CompanySeries,
  CompanyUser
};
