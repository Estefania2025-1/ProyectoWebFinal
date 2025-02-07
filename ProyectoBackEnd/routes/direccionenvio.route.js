const DireccionEnvioController = require('../controllers/dirrecionenvio.controller');

module.exports = (app) => {
    app.get('/direcciones-envio', DireccionEnvioController.getAllDireccionesEnvio);
    app.get('/direcciones-envio/:id', DireccionEnvioController.getDireccionEnvioById);
    app.get('/direcciones-envio-user/:id', DireccionEnvioController.getDireccionEnvioByUserId);
    app.post('/direcciones-envio', DireccionEnvioController.createDireccionEnvio);
    app.put('/direcciones-envio/:id', DireccionEnvioController.updateDireccionEnvio);
    app.delete('/direcciones-envio/:id', DireccionEnvioController.deleteDireccionEnvio);
};