const ProductController = require('../controllers/product.controller');

module.exports = (app) => {
    app.get('/productos', ProductController.getAllProducts);
    app.get('/productos/:id', ProductController.getProductById);
    app.post('/productos', ProductController.createProduct);
    app.put('/productos/:id', ProductController.updateProduct);
    app.delete('/productos/:id', ProductController.deleteProduct);
};