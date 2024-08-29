const { DataTypes } = require('sequelize');
const sequelize = require('../config/database').sequelize;

const HistoryChangesSinco = sequelize.define('historychangessinco', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: false,
        primaryKey: true
    },
    company_name: {
        type: DataTypes.STRING(256),
        allowNull: false,
        defaultValue: ''
    },
    custom_field1: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
    },
    custom_field2: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
    },
    custom_field3: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
    },
    date_change: {
        type: DataTypes.DATE
    },
    document_number: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: ''
    },
    dv: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: ''
    },
    is_html: {
        type: DataTypes.BOOLEAN
    },
    is_macroplantilla: {
        type: DataTypes.BOOLEAN
    },
    other_changes: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
    },
    user_creator: {
        type: DataTypes.STRING(256),
        allowNull: false,
        defaultValue: ''
    }

},{
    tableName: 'historychangessinco', //Nombre tabla
    timestamps: false, // Desactiva los timestamps
});

module.exports = HistoryChangesSinco;