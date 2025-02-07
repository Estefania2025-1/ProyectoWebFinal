const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.config');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
        validate: {
            notNull: { msg: 'El ID del usuario es requerido',},
        }
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: 'El nombre del usuario es requerido',},
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: { msg: 'El correo electrónico debe ser válido',},
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: 'La contraseña es requerida',},
        }
    },
    imagenPerfil: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    rol: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: 'El rol es requerido',},
            isIn: [['cliente', 'vendedor', 'distribuidor'], { msg: 'El rol debe ser "cliente" o "distribuidor"',}],
        }
    },
    telefono: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    estadoConexion: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isIn: [['activo', 'inactivo'], { msg: 'El estado debe ser "activo" o "inactivo"',}],
        }
    },
    estadoVendedor: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isIn: [['disponbile', 'occupado', 'inactivo'], { msg: 'El estado del vendedor debe ser "disponbile", "ocupado" o "inactivo"',}],
        },
        set(value) {
            if (this.rol === 'vendedor') {
                this.setDataValue('estadoVendedor', value);
            }
        }
    }

});

module.exports = User;
//force true

//isIn: [['disponbile', 'occupado', 'inactivo'], { msg: 'El estado del vendedor debe ser "disponbile", "ocupado" o "inactivo"',}],