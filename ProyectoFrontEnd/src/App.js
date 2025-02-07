import './App.css';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
import { UsuarioProvider } from './general/componentes/UsuarioContext';
import ProtectedRoute from './general/componentes/ProtectedRoute';

//import Header from './general/componentes/Header';
import VistaIngresos from './general/vistas/VistaIngresos';
import VistaRegistro from './general/vistas/VistaRegistro';
import VistaAboutNosotros from './general/vistas/VistaAboutNosotros';
import VistaContact from './general/vistas/VistaContact';
// import VistaPerfil from './general/vistas/VistaPerfil';

import ClienteMenu from './cliente/vistas/ClienteMenu';
import VistaProuductos from './cliente/vistas/VistaProductos';
import VistaDetalleProducto from './cliente/vistas/VistaDetalleProducto';
import VistaCarritoCompleto from './cliente/vistas/VistaCarritoCompleto';
import VistaPago from './cliente/vistas/VistaPago';
import VistaClientePerfil from './cliente/vistas/VistaClientePerfil';
import VistaPedido from './cliente/vistas/VistaPedido';
import VistaClienteDetallePedido from './cliente/vistas/VistaClienteDetallePedido';

import DistribuidorMenu from './distribuidor/vistas/DistribuidorMenu';
import VistaGestionVendedores from './distribuidor/vistas/VistaGestionVendedores';
import VistaGestionPedidos from './distribuidor/vistas/VistaGestionPedidos';
import VistaGestionProductos from './distribuidor/vistas/VistaGestionProductos';
import VistaDistribuidorProducto from './distribuidor/vistas/VistaDistribuidorProducto';
import VistaReporte from './distribuidor/vistas/VistaReporte';
import VistaMapaVendedores from './distribuidor/vistas/VistaMapaVendedores';
import VistaDistribuidorDetallePedido from './distribuidor/vistas/VistaDistribuidorDetallePedido';
import VistaDistribuidorPerfil from './distribuidor/vistas/VistaDistribuidorPerfil';

import VendedorMenu from './vendedor/vistas/VendedorMenu';
import VistaVendedorPedidos from './vendedor/vistas/VistaVendedorPedidos';
import VistaVendedorProducto from './vendedor/vistas/VistaVendedorProducto';
import VistaVendedorDetallePedido from './vendedor/vistas/VistaVendedorDetallePedido';
import VistaVendedorDetalleProducto from './vendedor/vistas/VistaVendedorDetalleProducto';

const App = () => {

  return (
    <UsuarioProvider>
      <BrowserRouter>

        <Routes>
          <Route path="/" element={<VistaIngresos></VistaIngresos>} />
          <Route path="/registrar" element={<VistaRegistro></VistaRegistro>} />
          <Route path="/sobreNosotros" element={<VistaAboutNosotros></VistaAboutNosotros>} />
          <Route path="/contactanos" element={<VistaContact></VistaContact>} />

          {/* Rutas protegidas */}
          <Route element={<ProtectedRoute requiredRole="cliente" />}>
            <Route path="/menuCliente" element={<ClienteMenu />} />
            <Route path='/perfil' element={<VistaClientePerfil />} />
            <Route path="/productos" element={<VistaProuductos />} />
            <Route path="/productoDetalle/:id" element={<VistaDetalleProducto />} />
            <Route path="/carrito" element={<VistaCarritoCompleto />} />
            <Route path="/pago" element={<VistaPago />} />
            <Route path="/pedidos" element={<VistaPedido />} />
            <Route path="/pedidoDetalle/:id" element={<VistaClienteDetallePedido />} />
          </Route>

          <Route element={<ProtectedRoute requiredRole="distribuidor" />}>
            <Route path="/menuDistribuidor" element={<DistribuidorMenu />} />
            <Route path="/gestionVendedores" element={<VistaGestionVendedores />} />
            <Route path="/gestionPedidos" element={<VistaGestionPedidos />} />
            <Route path="/gestionProductos" element={<VistaGestionProductos />} />
            <Route path="/productoDistribuidor/:id" element={<VistaDistribuidorProducto />} />
            <Route path="/reporte" element={<VistaReporte />}/>
            <Route path="/mapaVendedores" element={<VistaMapaVendedores />} />
            <Route path="/gestionPedidoDetalle/:id" element={<VistaDistribuidorDetallePedido />} />
            <Route path="/perfilDistribuidor" element={<VistaDistribuidorPerfil />} />
          </Route>

          <Route element={<ProtectedRoute requiredRole="vendedor" />}>
            <Route path="/menuVendedor" element={<VendedorMenu />} />
            <Route path="/pedidosVendedor" element={<VistaVendedorPedidos/>} />
            <Route path="/productoVendedor" element={<VistaVendedorProducto />} />
            <Route path="/vendedorPedidoDetalle/:id" element={<VistaVendedorDetallePedido/>} />
            <Route path="/vendedorProductoDetalle/:id" element={<VistaVendedorDetalleProducto />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </UsuarioProvider>
  );
};

export default App;
