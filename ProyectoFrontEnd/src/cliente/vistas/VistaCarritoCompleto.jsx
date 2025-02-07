import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUsuario } from '../../general/componentes/UsuarioContext';
import "./VistaCarritoCompleto.css";
import FooterCliente from "../componentes/FooterCliente";
import Header from '../../general/componentes/Header';
import Swal from "sweetalert2";

const VistaCarritoCompleto = () => {
    const { usuario } = useUsuario();
    const navigate = useNavigate();

    const [carrito, setCarrito] = useState(() => {
        const savedCarrito = localStorage.getItem(`carrito_${usuario.id}`);
        return savedCarrito ? JSON.parse(savedCarrito) : [];
    });
    
    useEffect(() => {
        if (!carrito || carrito.length === 0) {
            Swal.fire({
                title: 'Tu carrito está vacío',
                text: 'Por favor, agrega productos a tu carrito antes de continuar.',
                icon: 'warning',
                confirmButtonText: 'Ir a productos',
            }).then(() => {
                navigate('/productos');
            });
        }
    }, [carrito, navigate]);
    
    const actualizarCarrito = (nuevoCarrito) => {
        setCarrito(nuevoCarrito);
        localStorage.setItem(`carrito_${usuario.id}`, JSON.stringify(nuevoCarrito));
    };

    const handleIrPago = () => {
        navigate('/pago');
    };

    const handleIrAtras = () => {
        navigate('/productos');
    };


    return (
        <div className="vista-carrito-app">
            <Header/>
            <div className="contenedor-shop-principal">
                <h2>Shop</h2>
                <p>Home {'>'} Shop {'|'} Carrito</p>
            </div>

            <div className="vista-carrito-principal">

                <table className="tabla-carrito">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Tipo</th>
                            <th>Precio</th>
                            <th>Cantidad</th>
                            <th>Subtotal</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                    {carrito.map((producto, index) => (
                            <tr key={index} className="carrito-cliente-fila">
                                <td>
                                    <img src={producto.imagenPrincipal} alt={producto.nombre} className="vista-carrito-cliente-imagen" />
                                    <div>{producto.nombre}</div>
                                </td>
                                <td>{producto.tipoCompra === 'nuevo' ? 'Nuevo' : 'Recarga'}</td>
                                <td>${producto.tipoCompra === 'nuevo' ? producto.precioNuevo : producto.precioRecarga}</td>
                                <td>
                                    <input
                                        type="number"
                                        value={producto.cantidad}
                                        min="1"
                                        onChange={(e) => {
                                            const nuevaCantidad = parseInt(e.target.value, 10);
                                            const carritoActualizado = carrito.map(item =>
                                                item.id === producto.id && item.tipoCompra === producto.tipoCompra
                                                    ? { ...item, cantidad: nuevaCantidad }
                                                    : item
                                            );
                                            actualizarCarrito(carritoActualizado);
                                        }}
                                    />
                                </td>
                                <td>${(producto.tipoCompra === 'nuevo' ? producto.precioNuevo : producto.precioRecarga) * producto.cantidad}</td>
                                <td>
                                    <button className="cliente-carrito-btn-eliminar"
                                        onClick={() => {
                                            const carritoActualizado = carrito.filter(item => !(item.id === producto.id && item.tipoCompra === producto.tipoCompra));
                                            actualizarCarrito(carritoActualizado);
                                        }}
                                    >
                                        🗑️ Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* RESUMEN */}
                <div className="cliente-carrito-resumen">
                    <h2>RESUMEN</h2>
                    <div className="resumen-detalle">
                        <p>Subtotal: <span>${carrito.reduce((total, producto) => total + ((producto.tipoCompra === 'nuevo' ? producto.precioNuevo : producto.precioRecarga) * producto.cantidad), 0)}</span></p>
                        <p>Tarifa de envío: <span>$0.50</span></p>
                        <p>Total: <span>${carrito.reduce((total, producto) => total + ((producto.tipoCompra === 'nuevo' ? producto.precioNuevo : producto.precioRecarga) * producto.cantidad), 0) + 0.50}</span></p>
                    </div>
                    <button className="btn-comprar" onClick={handleIrPago}> Ir a pagar </button>
                </div>
            </div>

            <div className="btn-atras">
                <button onClick={handleIrAtras}> &lt; Atrás</button>
            </div>

            <FooterCliente />

        </div>
    );
};

export default VistaCarritoCompleto;
