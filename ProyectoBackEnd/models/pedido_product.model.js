const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.config');
const Pedido = require('./pedido.model');
const Product = require('./product.model');

const PedidoProducto = sequelize.define('PedidoProducto', {
    cantidadNuevo: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    precioNuevo: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    cantidadRecarga: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    precioRecarga: {
        type: DataTypes.FLOAT,
        allowNull: true,
    }
});

// Relacion productos con los pedidos
Pedido.belongsToMany(Product, { through: PedidoProducto });
Product.belongsToMany(Pedido, { through: PedidoProducto });

// Relacionel pedido con el producto (1:N)
PedidoProducto.belongsTo(Pedido, { foreignKey: 'PedidoId' });
PedidoProducto.belongsTo(Product, { foreignKey: 'ProductId' });

module.exports = PedidoProducto;
