const { DataTypes } = require('sequelize');
const sequelize = require('../config/database').sequelize;

const ReportsHistory = sequelize.define('reports_history', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    date: {
        type: DataTypes.DATE
    },
    json: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: ''
    },
    new_companies: {
        type: DataTypes.DECIMAL(18,0),
        allowNull: false,
        defaultValue: 0
    },
    new_money: {
        type: DataTypes.DECIMAL(18,0),
        allowNull: false,
        defaultValue: 0
    },
    report_type: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: ''
    },
    user: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: ''
    },
},{
    tableName: 'reports_history', //Nombre tabla
    timestamps: false, // Desactiva los timestamps
});

module.exports = ReportsHistory;