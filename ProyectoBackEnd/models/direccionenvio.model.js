const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.config');
const User = require('./user.model');

const DireccionEnvio = sequelize.define('DireccionEnvio', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    latitud: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    longitud: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    codigoPostal: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    otro: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
    }
});

// Relacion de un Cliente con varias direcciones de envio (1:N)
DireccionEnvio.belongsTo(User, { foreignKey: 'ClienteId' });

module.exports = DireccionEnvio;
