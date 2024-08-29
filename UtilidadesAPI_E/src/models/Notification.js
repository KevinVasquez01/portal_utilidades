const { DataTypes } = require('sequelize');
const sequelize = require('../config/database').sequelize;

const Notification = sequelize.define('notifications', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    icon: {
        type: DataTypes.STRING(256),
        allowNull: false,
        defaultValue: ''
    },
    notification: {
        type: DataTypes.STRING(256),
        allowNull: false,
        defaultValue: ''
    },
    profile: {
        type: DataTypes.STRING(256),
        allowNull: false,
        defaultValue: ''
    },
    round: {
        type: DataTypes.STRING(256),
        allowNull: false,
        defaultValue: ''
    },
    show: {
        type: DataTypes.BOOLEAN
    },
    text1: {
        type: DataTypes.STRING(256),
        allowNull: false,
        defaultValue: ''
    },
    text2: {
        type: DataTypes.STRING(256),
        allowNull: false,
        defaultValue: ''
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
    }
},{
    tableName: 'notifications', //Nombre tabla
    timestamps: false, // Desactiva los timestamps
});

module.exports = Notification;