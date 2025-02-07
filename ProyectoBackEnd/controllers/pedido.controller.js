const { response } = require('express');
const Pedido = require('../models/pedido.model');
const Product = require('../models/product.model');
const User = require('../models/user.model');
const DireccionEnvio = require('../models/direccionenvio.model');
const MetodoPago = require('../models/metodopago.model');
const TarjetaCredito = require('../models/tarjetacredito.model');

module.exports.createPedido = async (req, response) => {
    const { ClienteId, VendedorId, total, estado, estadoPago, fechaCreacion, DireccionEnvioId, MetodoPagoId, TarjetaCreditoId } = req.body;

    // Verificar que exite cliente y vendedor
    const user = await User.findOne({ where: { id: ClienteId } });
    if (!user) {
        return response.status(404).json({ message: 'Cliente no encontrado' });
    }

    if (user.rol !== 'cliente') {
        return response.status(403).json({ message: 'Solo los usuarios con el rol de cliente pueden crear pedidos' });
    }
    /*
    const vendedor = await User.findOne({ where: { id: VendedorId } });
    if (!vendedor) {
        return response.status(404).json({ message: 'Vendedor no encontrado' });
    }

    if (vendedor.rol !== 'vendedor') {
        return response.status(403).json({ message: 'Solo los usuarios con el rol de vendedor pueden ser asignados como vendedor en un pedido' });
    }
*/
    // Validar que todos los campos son obligatorios
    if (!total || !estado || !fechaCreacion || !estadoPago) {
        return response.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    if (!DireccionEnvioId) {
        return response.status(400).json({ message: 'La dirección de envío es obligatoria' });
    }

    if (!MetodoPagoId) {
        return response.status(400).json({ message: 'El metodo de pago es obligatorio' });
    }

    try {

        const direccionEnvio = await DireccionEnvio.findOne({ where: { id: DireccionEnvioId } });
        if (!direccionEnvio) {
            return response.status(404).json({ message: 'Dirección de envío no encontrada' });
        }

        const metodoPago = await MetodoPago.findOne({ where: { id: MetodoPagoId } });
        if (!metodoPago) {
            return response.status(404).json({ message: 'Metodo de pago no encontrado' });
        }

        // Validar el método de pago
        if (metodoPago.tipo === 'tarjeta_credito') {
            if (!TarjetaCreditoId) {
                return response.status(400).json({ message: 'Es obligatorio proporcionar un ID de tarjeta de crédito para el pago con tarjeta de crédito' });
            }

            const tarjetaCredito = await TarjetaCredito.findOne({ where: { id: TarjetaCreditoId } });
            if (!tarjetaCredito) {
                return response.status(404).json({ message: 'Tarjeta de crédito no encontrada' });
            }
        }

        if (metodoPago.tipo === 'efectivo' && TarjetaCreditoId !== null) {
            return response.status(400).json({ message: 'No se requiere tarjeta de crédito para el pago en efectivo' });
        }

        const newPedido = await Pedido.create({ ClienteId, VendedorId, total, estado, estadoPago, fechaCreacion, DireccionEnvioId, MetodoPagoId, TarjetaCreditoId: metodoPago.tipo === 'tarjeta_credito' ? TarjetaCreditoId : null });
        response.json(newPedido);
    } catch (error) {
        response.status(400).json({ message: 'Error al crear el pedido', error: error.errors || error.message });
    }
};



module.exports.getAllPedidos = async (_, response) => {
    try {
        const pedidos = await Pedido.findAll({
            include: [DireccionEnvio, MetodoPago, TarjetaCredito],
        });
        response.json(pedidos);
    } catch (error) {
        response.status(500).json(error);
    }
};

module.exports.getPedidoById = async (req, response) => {
    try {
        const pedido = await Pedido.findOne({ where: { id: req.params.id } });
        response.json(pedido);
    } catch (error) {
        response.status(500).json(error);
    }
};

module.exports.updatePedido = async (req, response) => {
    try {
        const [updatedRowCount] = await Pedido.update(req.body, { where: { id: req.params.id } });
        if (updatedRowCount) {
            const updatedPedido = await Pedido.findOne({ where: { id: req.params.id } });
            response.json(updatedPedido);
        } else {
            response.status(404).json({ message: 'Pedido no encontrado' });
        }
    } catch (error) {
        response.status(500).json(error);
    }
};

module.exports.deletePedido = async (req, response) => {
    try {
        const pedido = await Pedido.findOne({ where: { id: req.params.id } });
        if (!pedido) {
            return response.status(404).json({ message: 'Pedido no encontrado' });
        }
        await Pedido.destroy({ where: { id: req.params.id } });
        response.json(pedido);
    } catch (error) {
        response.status(500).json(error);
    }
};

module.exports.getPedidosByClienteId = async (req, response) => {
    try {
        const pedidos = await Pedido.findAll({ where: { ClienteId: req.params.clienteId } });
        response.json(pedidos);
    } catch (error) {
        response.status(500).json(error);
    }
};

module.exports.getPedidosByVendedorId = async (req, response) => {
    try {
        const pedidos = await Pedido.findAll({ where: { VendedorId: req.params.vendedorId } });
        response.json(pedidos);
    } catch (error) {
        response.status(500).json(error);
    }
};


module.exports.asignarPedidosAvendedor = async (req, response) => {
    try {
        const pedidosPendientes = await Pedido.findAll({ 
            where: { VendedorId: null }, 
            order: [['fechaCreacion', 'ASC']] 
        });

        const vendedoresDisponibles = await User.findAll({ 
            where: { rol: 'vendedor', estadoVendedor: 'disponbile' } 
        });

        console.log("Vendedores disponibles para asignar:", vendedoresDisponibles.map(v => ({ id: v.id, estadoVendedor: v.estadoVendedor })));

        for (const pedido of pedidosPendientes) {
            if (vendedoresDisponibles.length > 0) {
                const vendedorDisponible = vendedoresDisponibles.shift(); // Obtiene y elimina el primero

                // Actualiza el pedido asignándole un vendedor
                const [updatedRowCount] = await Pedido.update(
                    { VendedorId: vendedorDisponible.id },
                    { where: { id: pedido.id } }
                );

                if (updatedRowCount === 0) {
                    console.log(`No se pudo asignar el pedido ${pedido.id}`);
                    continue;  // Si no se actualizó ningún pedido, pasa al siguiente
                }

                console.log(`Pedido ${pedido.id} asignado a vendedor ${vendedorDisponible.id}`);

                // Cambia el estado del pedido a "confirmado"
                await Pedido.update(
                    { estado: 'confirmado' },
                    { where: { id: pedido.id } }
                );
                console.log(`Estado del pedido ${pedido.id} actualizado a "confirmado"`);


                // Actualiza el estado del vendedor a "ocupado"
                if (vendedorDisponible.rol === 'vendedor') {
                    const [vendedorUpdatedRowCount] = await User.update(
                        { estadoVendedor: 'occupado' },
                        { where: { id: vendedorDisponible.id }, validate: false }
                    );
                    
                    if (vendedorUpdatedRowCount === 0) {
                        console.log(`No se pudo actualizar el estado del vendedor ${vendedorDisponible.id}`);
                        const reintento = await User.update(
                            { estadoVendedor: 'occupado' },
                            { where: { id: vendedorDisponible.id } }
                        );
                        if (reintento[0] === 0) {
                            console.log(`Error persistente: no se puede actualizar el vendedor ${vendedorDisponible.id}`);
                        } else {
                            console.log(`Vendedor ${vendedorDisponible.id} reintento: estado actualizado correctamente`);
                        }
                    } else {
                        console.log(`Vendedor ${vendedorDisponible.id} actualizado a ocupado`);
                    }
                } else {
                    console.log(`Vendedor ${vendedorDisponible.id} no tiene el rol adecuado para ser actualizado`);
                }
                

                console.log(`Vendedor ${vendedorDisponible.id} actualizado a ocupado`);

                // Confirmar actualización
                //const vendedorConfirmado = await User.findOne({ where: { id: vendedorDisponible.id } });
                //console.log(`Estado del vendedor después de la actualización: ${vendedorConfirmado.estadoVendedor}`);
            }
        }

        response.json({ message: 'Pedidos asignados correctamente' });
    } catch (error) {
        console.error('Error al asignar pedidos:', error);
        response.status(500).json({ error: 'Hubo un error al asignar el pedido o actualizar el estado del vendedor.' });
    }
};

