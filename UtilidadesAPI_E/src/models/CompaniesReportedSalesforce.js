const { DataTypes } = require('sequelize');
const sequelize = require('../config/database').sequelize;

const CompaniesReportedSalesforces = sequelize.define('companiesreportedsalesforce', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    date_activation: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    document_number: {
        type: DataTypes.STRING(20),
        allowNull: true,
        defaultValue: ''
    },
    report_type: {
        type: DataTypes.STRING(120),
        allowNull: false,
        defaultValue: ''
    },
    user: {
        type: DataTypes.STRING(256),
        allowNull: false,
        defaultValue: '',
        field: 'user', // Nombre real de la columna en la base de datos
    },
},{
    tableName: 'companiesreportedsalesforce', //Nombre tabla
    timestamps: false, // Desactiva los timestamps
});

module.exports = CompaniesReportedSalesforces;