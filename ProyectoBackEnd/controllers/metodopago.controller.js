const MetodoPago = require('../models/metodopago.model');

module.exports.createMetodoPago = async (req, res) => {
    try {
        const { tipo, descripcion } = req.body;

        const nuevoMetodo = await MetodoPago.create({ tipo, descripcion });
        res.json(nuevoMetodo);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Error al crear el método de pago' });
    }
};

module.exports.getAllMetodosPago = async (_, res) => {
    try {
        const metodos = await MetodoPago.findAll();
        res.json(metodos);
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
};

module.exports.getMetodoPagoById = async (req, res) => {
    try {
        const metodo = await MetodoPago.findOne({ where: { id: req.params.id } });
        if (metodo) {
            res.json(metodo);
        } else {
            res.status(404).json({ message: 'Método de pago no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
};

module.exports.updateMetodoPago = async (req, res) => {
    try {
        const [rowsUpdated] = await MetodoPago.update(req.body, { where: { id: req.params.id } });
        if (rowsUpdated) {
            const metodoActualizado = await MetodoPago.findOne({ where: { id: req.params.id } });
            res.json(metodoActualizado);
        } else {
            res.status(404).json({ message: 'Método de pago no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
};

module.exports.deleteMetodoPago = async (req, res) => {
    try {
        const metodo = await MetodoPago.findOne({ where: { id: req.params.id } });
        if (metodo) {
            await MetodoPago.destroy({ where: { id: req.params.id } });
            res.json(metodo);
        } else {
            res.status(404).json({ message: 'Método de pago no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
};