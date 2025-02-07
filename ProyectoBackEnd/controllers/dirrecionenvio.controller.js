const DireccionEnvio = require('../models/direccionenvio.model');
const User = require('../models/user.model');

module.exports.createDireccionEnvio = async (req, res) => {
    const { otro, latitud, longitud, codigoPostal, timestamp, ClienteId } = req.body;

    const user = await User.findOne({ where: { id: ClienteId } });
    if (!user) {
        return response.status(404).json({ message: 'Cliente no encontrado' });
    }
    // Verificar que el rol del usuario sea 'cliente'
    if (user.rol !== 'cliente') {
        return res.status(403).json({ message: 'Solo los usuarios con el rol de cliente pueden crear direcciones de envío' });
    }

    try {
        const nuevaDireccion = await DireccionEnvio.create({otro, latitud, longitud, codigoPostal, timestamp, ClienteId });
        res.json(nuevaDireccion);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Error al crear la dirección de envío' });
    }
};

module.exports.getAllDireccionesEnvio = async (_, res) => {
    try {
        const direcciones = await DireccionEnvio.findAll();
        res.json(direcciones);
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
};

module.exports.getDireccionEnvioById = async (req, res) => {
    try {
        const direccion = await DireccionEnvio.findOne({ where: { id: req.params.id } });
        if (direccion) {
            res.json(direccion);
        } else {
            res.status(404).json({ message: 'Dirección no encontrada' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
};

module.exports.updateDireccionEnvio = async (req, res) => {
    try {
        const [rowsUpdated] = await DireccionEnvio.update(req.body, { where: { id: req.params.id } });
        if (rowsUpdated) {
            const direccionActualizada = await DireccionEnvio.findOne({ where: { id: req.params.id } });
            res.json(direccionActualizada);
        } else {
            res.status(404).json({ message: 'Dirección no encontrada' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
};

module.exports.deleteDireccionEnvio = async (req, res) => {
    try {
        const direccion = await DireccionEnvio.findOne({ where: { id: req.params.id } });
        if (direccion) {
            await DireccionEnvio.destroy({ where: { id: req.params.id } });
            res.json(direccion);
        } else {
            res.status(404).json({ message: 'Dirección no encontrada' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
};

module.exports.getDireccionEnvioByUserId = async (req, res) => {
    try {
        const direcciones = await DireccionEnvio.findAll({ where: { ClienteId: req.params.id } });
        if (direcciones.length > 0) {
            res.json(direcciones);
        } else {
            res.status(404).json({ message: 'No se encontraron direcciones para este cliente' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
};
