const { DataTypes } = require('sequelize');
const sequelize = require('../config/database').sequelize;

const UsersProfile = sequelize.define('usersprofiles', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: false,
        primaryKey: true
    },
    profile: {
        type: DataTypes.STRING(256),
        allowNull: false,
        defaultValue: ''
    },
    user: {
        type: DataTypes.STRING(512),
        allowNull: false,
        defaultValue: ''
    }
},{
    tableName: 'usersprofiles', //Nombre tabla
    timestamps: false, // Desactiva los timestamps
});

module.exports = UsersProfile;