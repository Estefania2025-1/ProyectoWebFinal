const UbicacionVendedor = require('../models/ubicacionvendedor.model');
const User = require('../models/user.model');

// crea la ubicacion del vendedor
module.exports.createUbicacionVendedor = async (req, res) => {
    const { latitud, longitud, codigoPostal, timestamp, VendedorId, otro } = req.body;

    // validar que existe el vendedor
    const user = await User.findOne({ where: { id: VendedorId } });
    if (!user) {
        return res.status(404).json({ message: 'Vendedor no encontrado' });
    }

    try {
        // crea la nueva ubicación
        const nuevaUbicacion = await UbicacionVendedor.create({ latitud, longitud, codigoPostal, timestamp, VendedorId, otro });
        res.status(201).json(nuevaUbicacion);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Error al crear la ubicación del vendedor' });
    }
};

// obtener todas las ubicaciones de vendedores
module.exports.getAllUbicacionesVendedor = async (_, res) => {
    try {
        const ubicaciones = await UbicacionVendedor.findAll();
        res.json(ubicaciones);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener ubicaciones de vendedores', error: error.message });
    }
};

// obtener una ubicación de vendedor por ID
module.exports.getUbicacionVendedorById = async (req, res) => {
    try {
        const ubicacion = await UbicacionVendedor.findOne({ where: { id: req.params.id } });
        if (ubicacion) {
            res.json(ubicacion);
        } else {
            res.status(404).json({ message: 'Ubicación no encontrada' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener la ubicación', error: error.message });
    }
};

// actualiza una ubicacion de vendedor por ID
module.exports.updateUbicacionVendedor = async (req, res) => {
    try {
        const [rowsUpdated] = await UbicacionVendedor.update(req.body, { where: { id: req.params.id } });
        if (rowsUpdated) {
            const ubicacionActualizada = await UbicacionVendedor.findOne({ where: { id: req.params.id } });
            res.json(ubicacionActualizada);
        } else {
            res.status(404).json({ message: 'Ubicación no encontrada' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar la ubicación', error: error.message });
    }
};

// eliminar una ubicacion de vendedor
module.exports.deleteUbicacionVendedor = async (req, res) => {
    try {
        const ubicacion = await UbicacionVendedor.findOne({ where: { id: req.params.id } });
        if (ubicacion) {
            await UbicacionVendedor.destroy({ where: { id: req.params.id } });
            res.json({ message: 'Ubicación eliminada correctamente', ubicacion });
        } else {
            res.status(404).json({ message: 'Ubicación no encontrada' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar la ubicación', error: error.message });
    }
};

// obtener todas las ubicaciones de un vendedor específico
module.exports.getUbicacionVendedorByVendedorId = async (req, res) => {
    try {
        const ubicaciones = await UbicacionVendedor.findAll({ where: { VendedorId: req.params.VendedorId } });
        if (ubicaciones.length > 0) {
            res.json(ubicaciones);
        } else {
            res.status(404).json({ message: 'No se encontraron ubicaciones para este vendedor' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener ubicaciones del vendedor', error: error.message });
    }
};
