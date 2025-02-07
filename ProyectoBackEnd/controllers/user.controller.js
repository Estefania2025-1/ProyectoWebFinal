const { response } = require('express');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');

const generateToken = (id) => {
    return jwt.sign({ id }, "hola", { expiresIn: '30d' });
}

module.exports.createUser = async (req, res) => {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
        return res.status(400).json({
            msg: 'Faltan datos, todos los campos son obligatorios'
        });
    }

    try {
        const userFound = await User.findOne({ where: { email } });
        if (userFound) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        // Hashear la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Crear el usuario en la base de datos con rol 'cliente' por defecto
        const user = await User.create({
            nombre,
            email,
            password: hashedPassword,
            rol: 'cliente',
        });

        res.json({ nombre: user.nombre, email: user.email, rol: user.rol, id: user.id, token: generateToken(user.id), });
    } catch (error) {
        res.status(400).json({ message: 'Error al crear el usuario', error: error.message });
    }

};

module.exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const userFound = await User.findOne({ where: { email } });

        if (userFound && await bcrypt.compare(password, userFound.password)) {
            const token = generateToken(userFound.id);

            res.json({
                message: 'Login Exitoso',
                email: userFound.email,
                rol: userFound.rol,
                id: userFound.id,
                token: generateToken(userFound.id)
            });
        } else {
            res.status(400).json({ message: 'Login Failed' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
    }
};

module.exports.verificarEmailExiste = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const userFound = await User.findOne({ where: { email } });
        if (userFound) {
            return res.status(400).json({ message: 'El correo ya está registrado. Por favor, ingrese otro correo diferente.' });
        } else {
            return res.status(200).json({ message: 'Correo correcto' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al verificar el correo', error: error.message });
    }
};

module.exports.getUserById = async (req, response) => {
    try {
        const user = await User.findOne({ where: { id: req.params.id } });
        response.json(user);

    } catch (error) {
        console.log(error);
        response.status(500).json(error);
    }
};

module.exports.updateTelefono = async (req, response) => {
    const { telefono } = req.body;

    if (!telefono) {
        return response.status(400).json({
            message: 'El teléfono es obligatorio'
        });
    }

    try {
        const [updatedRowCount] = await User.update({ telefono }, { where: { id: req.params.id } });

        if (updatedRowCount) {
            const updatedUser = await User.findOne({ where: { id: req.params.id } });

            response.json({
                message: 'Teléfono actualizado con éxito',
                user: updatedUser
            });
        } else {
            response.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error(error);
        response.status(500).json({
            message: 'Hubo un error al actualizar el teléfono',
            error: error.message
        });
    }
};

// subir la imagen de perfil
module.exports.subirImagenPerfil = async (req, res) => {
    const { id } = req.params;
    const imagenPerfilPath = `/uploads/${req.file.filename}`;

    try {
        const usuario = await User.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // actualizacion de la imagen en la bd
        usuario.imagenPerfil = imagenPerfilPath;
        await usuario.save();

        res.json({ imagenPerfil: imagenPerfilPath });
    } catch (error) {
        console.error("Error al guardar la imagen", error);
        res.status(500).json({ message: "Error al subir la imagen", error: error.message });
    }
};

module.exports.updateNombre = async (req, res) => {
    const { nombre } = req.body;

    if (!nombre) {
        return res.status(400).json({
            message: 'El nombre es obligatorio'
        });
    }

    try {
        const [updatedRowCount] = await User.update({ nombre }, { where: { id: req.params.id } });

        if (updatedRowCount) {
            const updatedUser = await User.findOne({ where: { id: req.params.id } });

            res.json({
                message: 'Nombre actualizado con éxito',
                user: updatedUser
            });
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Hubo un error al actualizar el nombre',
            error: error.message
        });
    }
};

module.exports.updateEmail = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            message: 'El correo es obligatorio'
        });
    }

    try {
        // verifica si el correo ya esta registrado
        const emailExists = await User.findOne({ where: { email } });
        if (emailExists) {
            return res.status(400).json({ message: 'El correo ya está registrado. Por favor, ingrese otro correo.' });
        }

        // actualiza el correo en la base de datos
        const [updatedRowCount] = await User.update({ email }, { where: { id: req.params.id } });

        if (updatedRowCount) {
            const updatedUser = await User.findOne({ where: { id: req.params.id } });

            res.json({
                message: 'Correo actualizado con éxito',
                user: updatedUser
            });
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Hubo un error al actualizar el correo',
            error: error.message
        });
    }
};


module.exports.updatePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({
            message: 'Ambas contraseñas (actual y nueva) son obligatorias'
        });
    }

    try {
        // Verificar si la pasww actual coincide con la almacenada
        const user = await User.findOne({ where: { id: req.params.id } });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'La contraseña actual es incorrecta' });
        }

        // Hashear la nueva passw
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Actualizar la passw en la base de datos
        user.password = hashedPassword;
        await user.save();

        res.json({
            message: 'Contraseña actualizada con éxito'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Hubo un error al actualizar la contraseña',
            error: error.message
        });
    }
};


// DISTRIBUIDOR **************

module.exports.getUsuariosPorRol = async (req, res) => {
    try {
        const usuarios = await User.findAll({ where: { rol: req.params.rol } });
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los usuarios', error: error.message });
    }
};

module.exports.getAllVendedores = async (req, res) => {
    try {
        if (!req.user || req.user.rol !== 'distribuidor') {
            return res.status(401).json({ message: 'No autorizado, solo distribuidores pueden ver los vendedores' });
        }

        const vendedores = await User.findAll({ where: { rol: 'vendedor' } });
        res.json(vendedores);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los vendedores', error: error.message });
    }
};


module.exports.createVendedor = async (req, res) => {
    const { nombre, email, password, estadoVendedor } = req.body;

    // el distribuidor debe estar autenticado para poder registrar un vendedor
    if (!req.user || req.user.rol !== 'distribuidor') {
        return res.status(401).json({ message: 'No autorizado, solo distribuidores pueden registrar vendedores' });
    }

    if (!nombre || !email || !password) {
        return res.status(400).json({ message: 'Missing fields, all are mandatory!' });
    }

    try {
        // verifica si el vendedor ya existe
        const userFound = await User.findOne({ where: { email } });
        if (userFound) {
            return res.status(400).json({ message: 'El vendedor ya existe' });
        }

        // hashear la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // crear el usuario como vendedor
        const vendedor = await User.create({
            nombre,
            email,
            password: hashedPassword,
            rol: 'vendedor',
            estadoVendedor: "disponbile",
        });

        // respuesta con el vendedor creado y el token
        res.json({ nombre: vendedor.nombre, email: vendedor.email, rol: vendedor.rol, id: vendedor.id, estadoVendedor: vendedor.estadoVendedor, token: generateToken(vendedor.id) });
    } catch (error) {
        res.status(400).json({ message: 'Error al registrar al vendedor', error: error.message });
    }
};


module.exports.updateVendedor = async (req, response) => {
    try {
        if (!req.user || req.user.rol !== 'distribuidor') {
            return res.status(401).json({ message: 'No autorizado, solo distribuidores pueden editar vendedores' });
        }

        const [updatedRowCount] = await User.update(req.body, { where: { id: req.params.id } });
        if (updatedRowCount) {
            const updateVendedor = await User.findOne({ where: { id: req.params.id } });
            response.json(updateVendedor);
        } else {
            response.status(404).json({ message: 'Pedido no encontrado' });
        }
    } catch (error) {
        response.status(500).json(error);
    }
};

module.exports.deleteVendedor = async (req, response) => {
    try {
        const vendedor = await User.findOne({ where: { id: req.params.id } });
        if (!vendedor) {
            return response.status(404).json({ message: 'Vendedor no encontrado' });
        }
        await User.destroy({ where: { id: req.params.id } });
        response.json(vendedor);
    } catch (error) {
        response.status(500).json(error);
    }
}


// se crea el primer distribuidor (si no existe ninguno)
module.exports.createDistributor = async (req, res) => {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    try {
        // verificar si ya existe un distribuidor en la base de datos
        const distributorFound = await User.findOne({ where: { rol: 'distribuidor' } });

        // si ya existe un distribuidor, no permitir crear otro distribuidor
        if (distributorFound) {
            return res.status(400).json({ message: 'Ya existe un distribuidor en el sistema' });
        }

        // hashear la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // crear el primer distribuidor en la base de datos
        const distributor = await User.create({
            nombre,
            email,
            password: hashedPassword,
            rol: 'distribuidor',
        });

        res.json({
            nombre: distributor.nombre,
            email: distributor.email,
            rol: distributor.rol,
            id: distributor.id,
            token: generateToken(distributor.id)
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el distribuidor', error: error.message });
    }
};



