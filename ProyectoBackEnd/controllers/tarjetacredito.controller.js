const TarjetaCredito = require('../models/tarjetacredito.model');
const User = require('../models/user.model');
const MetodoPago = require('../models/metodopago.model');

module.exports.createTarjetaCredito = async (req, res) => {
    try {
        const { numeroTarjeta, fechaVencimiento, nombreTitular, codigoSeguridad, tipoTarjeta, ClienteId, MetodoPagoId } = req.body;

        if (!numeroTarjeta || !fechaVencimiento || !nombreTitular || !codigoSeguridad || !ClienteId || !tipoTarjeta) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }
        let metodoPagoId = MetodoPagoId;

        if (!metodoPagoId) {
            const metodoPago = await MetodoPago.findOne({ where: { tipo: 'tarjeta_credito' } });
            if (metodoPago) {
                metodoPagoId = metodoPago.id;
            } else {
                return res.status(404).json({ message: 'Método de pago tarjeta de crédito no encontrado' });
            }
        }

        const user = await User.findOne({ where: { id: ClienteId } });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const nuevaTarjeta = await TarjetaCredito.create({
            numeroTarjeta,
            fechaVencimiento,
            nombreTitular,
            codigoSeguridad,
            ClienteId,
            MetodoPagoId: metodoPagoId,
            tipoTarjeta
        });

        res.json(nuevaTarjeta);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Error al crear la tarjeta de crédito' });
    }
};

module.exports.getAllTarjetasCredito = async (_, res) => {
    try {
        const tarjetas = await TarjetaCredito.findAll();
        res.json(tarjetas);
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
};

module.exports.getTarjetaCreditoById = async (req, res) => {
    try {
        const tarjeta = await TarjetaCredito.findOne({ where: { id: req.params.id } });
        if (tarjeta) {
            res.json(tarjeta);
        } else {
            res.status(404).json({ message: 'Tarjeta no encontrada' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
};

module.exports.updateTarjetaCredito = async (req, res) => {
    try {
        const [rowsUpdated] = await TarjetaCredito.update(req.body, { where: { id: req.params.id } });
        if (rowsUpdated) {
            const tarjetaActualizada = await TarjetaCredito.findOne({ where: { id: req.params.id } });
            res.json(tarjetaActualizada);
        } else {
            res.status(404).json({ message: 'Tarjeta no encontrada' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
};

module.exports.deleteTarjetaCredito = async (req, res) => {
    try {
        const tarjeta = await TarjetaCredito.findOne({ where: { id: req.params.id } });
        if (tarjeta) {
            await TarjetaCredito.destroy({ where: { id: req.params.id } });
            res.json(tarjeta);
        } else {
            res.status(404).json({ message: 'Tarjeta no encontrada' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
};

module.exports.getAllTarjetasCreditoByUserId = async (req, res) => {
    try {
        const tarjetas = await TarjetaCredito.findAll({ where: { ClienteId: req.params.id } });
        if (tarjetas.length > 0) {
            res.json(tarjetas);
        } else {
            res.status(404).json({ message: 'No se encontraron tarjetas de crédito para este usuario' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
};

