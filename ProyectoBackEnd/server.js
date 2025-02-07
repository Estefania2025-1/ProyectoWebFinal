const express = require('express');
const cors = require('cors');
const app = express(); 
const port = 8000; 
const path = require('path');

app.use(cors()); //agregado para que use con frontend
app.use(express.json());
app.use(express.urlencoded({extended: true})); // 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const allUserRoute = require('./routes/user.route');
allUserRoute(app);

const allProductRoute = require('./routes/product.route');
allProductRoute(app);

const allPedidoRoute = require('./routes/pedido.route');
allPedidoRoute(app);

const allPedidoProductRoute = require('./routes/pedido_product.route');
allPedidoProductRoute(app);

const allDireccionEnvioRoute = require('./routes/direccionenvio.route');
allDireccionEnvioRoute(app);

const allMetodoPagoRoute = require('./routes/metodopago.route');
allMetodoPagoRoute(app);

const allTarjetaCreditoRoute = require('./routes/tarjetacredito.route');
allTarjetaCreditoRoute(app);

const allUbicacionVendedorRoute = require('./routes/ubicacionvendedor.route');
allUbicacionVendedorRoute(app);

app.listen(port, function () {
    console.log('app.js escuchando en el puerto', port);
});



