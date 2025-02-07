const {DataTypes} = require('sequelize');
const sequelize = require('../config/sequelize.config');

const MetodoPago = sequelize.define('MetodoPago', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    tipo: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['efectivo', 'tarjeta_credito']], 
        }
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: true,
    }
});

module.exports = MetodoPago;