const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.config');
const User = require('./user.model');
const MetodoPago = require('./metodopago.model');

const TarjetaCredito = sequelize.define('TarjetaCredito', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    numeroTarjeta: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [16],
        }
    },
    fechaVencimiento: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    nombreTitular: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    codigoSeguridad: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [3, 4],
        }
    },
    tipoTarjeta: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: {
                args: [['Visa', 'MasterCard', 'Discover', 'American Express']],
                msg: 'El tipo de tarjeta debe ser Visa, MasterCard, Discover o American Express.'
            }
        }
    }
});

// Relacion la tarjeta de creadito con el usuario (1:N)
TarjetaCredito.belongsTo(User, { foreignKey: 'ClienteId' });
TarjetaCredito.belongsTo(MetodoPago, { foreignKey: 'MetodoPagoId' });

module.exports = TarjetaCredito;
