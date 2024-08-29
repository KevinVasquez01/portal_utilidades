const { DataTypes } = require('sequelize');
const sequelize = require('../config/database').sequelize;

const UsersMovement = sequelize.define('users_movements', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    ambient: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: ''
    },
    component: {
        type: DataTypes.STRING(512),
        allowNull: false,
        defaultValue: ''
    },
    date: {
       type: DataTypes.DATE,
       allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
    },
    user: {
        type: DataTypes.STRING(512),
        allowNull: false,
        defaultValue: ''
    },
},{
    tableName: 'users_movements', //Nombre tabla
    timestamps: false, // Desactiva los timestamps
});

module.exports = UsersMovement;