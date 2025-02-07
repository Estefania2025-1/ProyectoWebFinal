const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.config');
const User = require('./user.model'); 
const DireccionEnvio = require('./direccionenvio.model');
const MetodoPago = require('./metodopago.model');
const TarjetaCredito = require('./tarjetacredito.model');

const Pedido = sequelize.define('Pedido', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    total: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    estado: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['pendiente', 'en camino', 'confirmado', 'entregado']],
        },
    },
    estadoPago: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['pendiente', 'pagado']],
        },
    },
    fechaCreacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
    },
    fechaEstimadaLlegada: {
        type: DataTypes.DATE,
        allowNull: true,
    }
});

// Relacion el pedido con el cliente y vendedor (1:N)
Pedido.belongsTo(User, { foreignKey: 'ClienteId' });
Pedido.belongsTo(User, { foreignKey: 'VendedorId'});

Pedido.belongsTo(DireccionEnvio, { foreignKey: 'DireccionEnvioId' });
Pedido.belongsTo(MetodoPago, { foreignKey: 'MetodoPagoId' });
Pedido.belongsTo(TarjetaCredito, { foreignKey: 'TarjetaCreditoId' , allowNull: true });

module.exports = Pedido;