const UbicacionVendedorController = require('../controllers/ubicacionvendedor.controller');

module.exports = (app) => {
    app.get('/ubicaciones-vendedor', UbicacionVendedorController.getAllUbicacionesVendedor);
    app.get('/ubicaciones-vendedor/:id', UbicacionVendedorController.getUbicacionVendedorById);
    app.get('/ubicaciones-vendedor-vendedor/:VendedorId', UbicacionVendedorController.getUbicacionVendedorByVendedorId);
    app.post('/ubicaciones-vendedor', UbicacionVendedorController.createUbicacionVendedor);
    app.put('/ubicaciones-vendedor/:id', UbicacionVendedorController.updateUbicacionVendedor);
    app.delete('/ubicaciones-vendedor/:id', UbicacionVendedorController.deleteUbicacionVendedor);
};
