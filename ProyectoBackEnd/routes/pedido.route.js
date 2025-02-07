const PedidoController = require('../controllers/pedido.controller');

module.exports = (app) => {
    app.get('/pedidos', PedidoController.getAllPedidos);
    app.get('/pedidos/:id', PedidoController.getPedidoById);
    app.post('/pedidos', PedidoController.createPedido);
    app.put('/pedidos/:id', PedidoController.updatePedido);
    app.delete('/pedidos/:id', PedidoController.deletePedido);
    
    app.get('/pedidos-cliente/:clienteId', PedidoController.getPedidosByClienteId);
    app.get('/pedidos-vendedor/:vendedorId', PedidoController.getPedidosByVendedorId);

    app.post('/asignar-pedidos', PedidoController.asignarPedidosAvendedor);
};