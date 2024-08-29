const { DataTypes } = require('sequelize');
const sequelize = require('../config/database').sequelize;

const DefaultTemplate = sequelize.define('defaulttemplates', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: ''
    },
    documenttype: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: ''
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: ''
    }
},{
    tableName: 'defaulttemplates', //Nombre tabla
    timestamps: false, // Desactiva los timestamps
});

module.exports = DefaultTemplate;