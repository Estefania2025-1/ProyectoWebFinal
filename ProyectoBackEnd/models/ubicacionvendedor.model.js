const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.config');
const User = require('./user.model'); // Importamos el modelo de usuario

const UbicacionVendedor = sequelize.define('UbicacionVendedor', {
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
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
    },
    codigoPostal: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    otro: {
        type: DataTypes.STRING,
        allowNull: true,
    }
});

UbicacionVendedor.belongsTo(User, { foreignKey: 'VendedorId' });

module.exports = UbicacionVendedor;
