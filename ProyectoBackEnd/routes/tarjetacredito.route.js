const TarjetaCreditoController = require('../controllers/tarjetacredito.controller');

module.exports = (app) => {
    app.get('/tarjetascredito', TarjetaCreditoController.getAllTarjetasCredito);
    app.get('/tarjetascredito/:id', TarjetaCreditoController.getTarjetaCreditoById);
    app.get('/tarjetascredito-user/:id', TarjetaCreditoController.getAllTarjetasCreditoByUserId);
    app.post('/tarjetascredito', TarjetaCreditoController.createTarjetaCredito);
    app.put('/tarjetascredito/:id', TarjetaCreditoController.updateTarjetaCredito);
    app.delete('/tarjetascredito/:id', TarjetaCreditoController.deleteTarjetaCredito);
};