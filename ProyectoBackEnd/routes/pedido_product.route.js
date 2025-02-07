const PedidoProductoController = require('../controllers/pedido_product.controller');

module.exports = (app) => {
    app.post('/pedidos-productos', PedidoProductoController.addProductToPedido);
    app.get('/pedidos-productos/:pedidoId', PedidoProductoController.getProductosByPedido);
    app.get('/pedidos-productos', PedidoProductoController.getAllPedidoProductos);
};