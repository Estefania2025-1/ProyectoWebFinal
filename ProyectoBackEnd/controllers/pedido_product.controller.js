const Product = require('../models/product.model');
const Pedido = require('../models/pedido.model');
const PedidoProducto = require('../models/pedido_product.model');

// Agregar un producto a un pedido
module.exports.addProductToPedido = async (req, response) => {
    try {
        const productos = req.body; 
        console.log('Datos recibidos:', productos);

        for (let producto of productos) {
            const { PedidoId, ProductId, cantidadNuevo, precioNuevo, cantidadRecarga, precioRecarga } = producto;

            if (!PedidoId || !ProductId) {
                return response.status(400).json({ message: 'Faltan parámetros: PedidoId o ProductId' });
            }

            const pedido = await Pedido.findOne({ where: { id: PedidoId } });
            const product = await Product.findOne({ where: { id: ProductId } });

            if (!pedido) {
                return response.status(404).json({ message: 'Pedido no encontrado' });
            }
            if (!product) {
                return response.status(404).json({ message: 'Producto no encontrado' });
            }

            // Verificar que la cantidad del producto en inventario sea suficiente
            if (product.cantidad < (cantidadNuevo + cantidadRecarga)) {
                return response.status(400).json({ message: 'No hay suficiente stock disponible para este producto. Solo que quedan ' + product.cantidad + ' unidades' });
            }

            // Crear el registro de la relación entre pedido y producto
            await PedidoProducto.create({ PedidoId, ProductId, cantidadNuevo, precioNuevo, cantidadRecarga, precioRecarga });

            // Actualizar la cantidad del producto en inventario
            product.cantidad -= (cantidadNuevo + cantidadRecarga);

            // Actualizar la disponibilidad del producto
            let disponibilidad = 'disponible';
            if (product.cantidad === 0) {
                disponibilidad = 'agotado';
            } else if (product.cantidad < 5) {
                disponibilidad = 'poca disponibilidad';
            }
            product.disponibilidad = disponibilidad;
            // Guardar el producto con la cantidad y disponibilidad actualizada
            await product.save();
        }

        response.json({ message: 'Productos agregados al pedido correctamente.' });
    } catch (error) {
        console.error('Error al agregar producto al pedido:', error);
        response.status(500).json({ message: 'Error interno del servidor', error: error.errors || error.message });
    }
};

// Obtener los productos de un pedido
module.exports.getProductosByPedido = async (req, response) => {
    try {
        const pedidoProducto = await PedidoProducto.findAll({ 
            where: { pedidoId: req.params.pedidoId },
            include: [Product] 
        });
        if (pedidoProducto.length === 0) {
            return res.status(404).json({ message: 'No se encontraron productos para este pedido.' });
        }

        response.json(pedidoProducto);
    } catch (error) {
        response.status(500).json(error);
    }
};

module.exports.getAllPedidoProductos = async (_, response) => {
    try {
        const pedidoProductos = await PedidoProducto.findAll({
            include: [Product, Pedido] 
        });
        response.json(pedidoProductos);
    } catch (error) {
        response.status(500).json(error);
    }
};

