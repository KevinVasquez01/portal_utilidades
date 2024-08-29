const { DataTypes } = require('sequelize');
const sequelize = require('../config/database').sequelize;

const DataElement = sequelize.define('dataelements', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: false,
        primaryKey: true
    },
    json: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
    },
    module: {
        type: DataTypes.STRING(128),
        allowNull: false,
        defaultValue: ''
    }
},{
    tableName: 'dataelements', //Nombre tabla
    timestamps: false, // Desactiva los timestamps
});

module.exports = DataElement;