const UserController = require('../controllers/user.controller');
const { protect, protectDistributor } = require('../middleware/protect');
const upload = require('../middleware/upload'); 

module.exports = (app) => {
    app.post('/login', UserController.loginUser);
    app.post('/registrar', UserController.createUser);
    app.post('/registrar-distribuidor', UserController.createDistributor);
    app.post('/agregar-vendedor', protect, protectDistributor, UserController.createVendedor);
    app.post('/verificarEmailExiste', UserController.verificarEmailExiste);
    app.get('/usuario/:id', UserController.getUserById);

    app.get('/vendedores', protect, protectDistributor, UserController.getAllVendedores);
    app.put('/editarVendedor/:id', protect, protectDistributor, UserController.updateVendedor);
    app.delete('/eliminarVendedor/:id', protect, protectDistributor, UserController.deleteVendedor);
    app.get('/usuariosRol/:rol', UserController.getUsuariosPorRol);

    app.post('/usuario/subir-imagen/:id', protect, upload.single('imagenPerfil'), UserController.subirImagenPerfil);
    app.put('/usuario/actualizar-telefono/:id', UserController.updateTelefono);
    app.put('/usuario/actualizar-correo/:id', UserController.updateEmail);
    app.put('/usuario/actualizar-nombre/:id', UserController.updateNombre);
    app.put('/usuario/actualizar-password/:id', protect, UserController.updatePassword);

};