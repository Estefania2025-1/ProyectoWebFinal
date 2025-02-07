const MetodoPagoController = require('../controllers/metodopago.controller');

module.exports = app => {
    app.route('/metodopago').get(MetodoPagoController.getAllMetodosPago);
    app.route('/metodopago/:id').get(MetodoPagoController.getMetodoPagoById);
    app.route('/metodopago').post(MetodoPagoController.createMetodoPago);
    app.route('/metodopago/:id').put(MetodoPagoController.updateMetodoPago);
    app.route('/metodopago/:id').delete(MetodoPagoController.deleteMetodoPago);
};