const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.config');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        validate: {
            notNull: { msg: 'El ID del producto es requerido', },
        }
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: 'El nombre del producto es requerido', },
        }
    },
    tipo: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: 'El tipo del producto es requerido', },
        }
    },
    subtipo: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: 'La marca del producto es requerida', },
        }
    },
    peso: {
        type: DataTypes.FLOAT,
        allowNull: false,

    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notNull: { msg: 'La cantidad del producto es requerida', },
        }
    },
    precioNuevo: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            notNull: { msg: 'El precio del producto nuevo es requerido', },
        }
    },
    precioRecarga: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            notNull: { msg: 'El precio del producto recargado es requerido', },
        }
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: 'La descripción del producto es requerida', },
        }
    },
    informacionAdicional: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    imagenPrincipal: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: 'La imagen principal del producto es requerida', },
        }
    },
    imagenesSecundarias: {
        type: DataTypes.JSON, 
        allowNull: true,
    },
    esRecargable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        validate: {
            notNull: { msg: 'El campo esRecargable es requerido', },
        }
    },
    disponibilidad: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['disponible', 'poca disponibilidad', 'agotado'], { msg: 'El estado debe ser "disponible", "poca disponibilidad" o "agotado"',}],
        },
    }
});

module.exports = Product;
