import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUsuario } from '../../general/componentes/UsuarioContext';
import "./VistaPago.css";
import FooterCliente from "../componentes/FooterCliente";
import AgregarTarjeta from "../componentes/AgregarTarjeta";
import Header from '../../general/componentes/Header';
import Swal from 'sweetalert2';
import { use } from "react";

const VistaPago = () => {
    const navigate = useNavigate();
    const { usuario } = useUsuario();
    const usuarioId = usuario.id;
    const [direcciones, setDirecciones] = useState([]);
    const [metodoPago, setMetodoPago] = useState(null);
    const [tarjetaSeleccionada, setTarjetaSeleccionada] = useState(null);

    const [carrito, setCarrito] = useState(() => {
        const savedCarrito = localStorage.getItem(`carrito_${usuarioId}`);
        return savedCarrito ? JSON.parse(savedCarrito) : [];
    });

    const [direccion, setDireccion] = useState("");
    const [tarjetasCredito, setTarjetasCredito] = useState([]);
    const [metodosPago, setMetodosPago] = useState([]);
    const [mostrarAgregarTarjeta, setMostrarAgregarTarjeta] = useState(false);

    useEffect(() => {
        if (usuario && usuario.id) {
            axios.get(`http://localhost:8000/direcciones-envio-user/${usuario.id}`)
                .then((response) => {
                    console.log(response.data);
                    setDirecciones(response.data);
                })
                .catch((error) => {
                    console.error('Error al obtener las direcciones:', error);
                });
            axios.get(`http://localhost:8000/tarjetascredito-user/${usuario.id}`)
                .then(response => {
                    setTarjetasCredito(response.data);
                })
                .catch(error => {
                    console.error('Error al obtener las tarjetas de crédito:', error);
                });
            axios.get('http://localhost:8000/metodopago')
                .then(response => {
                    setMetodosPago(response.data);
                })
                .catch(error => {
                    console.error('Error al obtener los métodos de pago:', error);
                });

        }
    }, [usuario]);

    const calcularTotal = () => {
        return carrito.reduce((total, producto) => {
            const precio = producto.tipoCompra === 'nuevo' ? producto.precioNuevo : producto.precioRecarga;
            return total + (precio * producto.cantidad);
        }, 0);
    };


    const handleMetodoPagoChange = (e) => {
        const metodoSeleccionado = e.target.value;
        setMetodoPago(metodoSeleccionado);

        if (metodoSeleccionado !== "tarjeta") {
            setMostrarAgregarTarjeta(false);
        }
    };

    const handleTarjetaSeleccionada = (e) => {
        setTarjetaSeleccionada(e.target.value);
    };

    const cerrarVistaAgregarTarjeta = () => {
        setMostrarAgregarTarjeta(false);
    };


    const handleAgregarTarjeta = (nuevaTarjeta) => {
        if (!nuevaTarjeta.tipoTarjeta || !nuevaTarjeta.numeroTarjeta || !nuevaTarjeta.fechaVencimiento || !nuevaTarjeta.codigoSeguridad || !nuevaTarjeta.nombreTitular) {
            Swal.fire('Error', 'Por favor, completa toda la información de la tarjeta.', 'error');
            return;
        }
        const tarjetaConUsuario = {
            ...nuevaTarjeta,
            ClienteId: usuario.id
        };

        axios.post('http://localhost:8000/tarjetascredito', tarjetaConUsuario)
            .then(response => {
                console.log("Tarjeta agregada con éxito:", response.data);
                setTarjetasCredito([...tarjetasCredito, response.data]);
                // alert("Tarjeta agregada con éxito.");
                Swal.fire('Éxito', 'Tarjeta agregada con éxito.', 'success');
                setMostrarAgregarTarjeta(false);
            })
            .catch(error => {
                console.error("Error al agregar la tarjeta:", error);
                // alert("Hubo un error al agregar la tarjeta. Intenta de nuevo.");
                Swal.fire('Error', 'Hubo un error al agregar la tarjeta. Intenta de nuevo.', 'error');
            });
    };

    const handleConfirmarPago = async () => {
        if (!usuario.id) {
            Swal.fire('Error', 'No has iniciado sesión.', 'error');
            return;
        }

        const direccionSeleccionada = direcciones.find((dir) => dir.id === direccion);
        console.log(direccionSeleccionada);
        if (!direccionSeleccionada) {
            Swal.fire('Error', 'Por favor, selecciona una dirección de envío.', 'error');
            return;
        }

        if (!metodoPago) {
            Swal.fire('Error', 'Por favor, selecciona un método de pago.', 'error');
            return;
        }

        if (metodoPago === "tarjeta" && !tarjetaSeleccionada) {
            // alert("Por favor, selecciona una tarjeta de crédito.");
            Swal.fire('Error', 'Por favor, selecciona una tarjeta de crédito.', 'error');
            return;
        }

        const metodoPagoEncontrado = metodosPago.find(metodo => metodo.tipo === (metodoPago === "tarjeta" ? "tarjeta_credito" : "efectivo"));

        if (!metodoPagoEncontrado) {
            Swal.fire('Error', 'Método de pago no válido.', 'error');
            return;
        }

        const metodoPagoId = metodoPagoEncontrado.id;
        const estadoPago = metodoPago === "tarjeta" ? "pagado" : "pendiente";
        const tarjetaId = metodoPago === "tarjeta" ? tarjetaSeleccionada : null;

        console.log("Método de pago seleccionado:", metodoPago);
        console.log("ID de método de pago:", metodoPagoId);

        console.log("Dirección de envío seleccionada:", direccionSeleccionada.id);

        try {
            // FALTAAA estadoPago, si es tarjeta de credito se establece como pagado, si es efectivo como pendiente
            const nuevoPedido = {
                ClienteId: usuario.id,
                DireccionEnvioId: direccionSeleccionada.id,
                estado: "pendiente",
                estadoPago,
                total: calcularTotal() + 0.50,
                MetodoPagoId: metodoPagoId,
                TarjetaCreditoId: tarjetaId,
                fechaCreacion: new Date().toISOString(),
                VendedorId: null
            };

            // Esperar a que se cree el pedido
            const response = await axios.post('http://localhost:8000/pedidos', nuevoPedido);
            const pedidoId = response.data.id;

            console.log('Pedido creado con éxito:', response.data);
            console.log('Pedido ID:', pedidoId);

            const nuevoPedidoProducto = carrito.reduce((acumulador, producto) => {
                // busqueda del product para ver si ya se encuentra
                let productoExistente = acumulador.find(p => p.ProductId === producto.id);
            
                if (productoExistente) {
                    // Si es que ya existe, se sumaaa las cantidades
                    if (producto.tipoCompra === 'nuevo') {
                        productoExistente.cantidadNuevo += producto.cantidad;
                    } else if (producto.tipoCompra === 'recarga') {
                        productoExistente.cantidadRecarga += producto.cantidad;
                    }
                } else {
                    // Si no existe, toca agregar
                    acumulador.push({
                        PedidoId: pedidoId,
                        ProductId: producto.id,
                        cantidadNuevo: producto.tipoCompra === 'nuevo' ? producto.cantidad : 0,
                        precioNuevo: producto.precioNuevo,
                        cantidadRecarga: producto.tipoCompra === 'recarga' ? producto.cantidad : 0,
                        precioRecarga: producto.precioRecarga
                    });
                }
            
                return acumulador;
            }, []);
            
            console.log("Nuevo pedido de productos luego de axios:", nuevoPedidoProducto);
            

            axios.post('http://localhost:8000/pedidos-productos', nuevoPedidoProducto)
                .then(response => {
                    console.log('Pedido de productos creado conxito:', response.data);
                })
                .catch(error => {
                    console.error('Error al crear el pedido de productos:', error);

                    if (error.response) {
                        console.error("Detalles del error:", error.response.data);
                        Swal.fire('Error', `Hubo un problema al agregar los productos: ${error.response.data.message}`, 'error');
                    } else {
                        Swal.fire('Error', 'Error desconocido al agregar los productos. Intenta nuevamente.', 'error');
                    }
                });

            console.log('Nuevo pedido de productos luego de axios:', nuevoPedidoProducto);

            Swal.fire('Éxito', 'Pedido realizado con éxito!', 'success');
            localStorage.setItem(`carrito_${usuario.id}`, JSON.stringify([]));
            setCarrito([]);
            navigate('/menuCliente');
        } catch (error) {
            console.error('Error al realizar el pedido:', error);
            if (error.response) {
                console.error("Detalles del error:", error.response.data);
            }
            Swal.fire('Error', 'Hubo un error al realizar el pedido. Intenta de nuevo.', 'error');
        }
    };

    const handleIrAtras = () => {
        navigate('/carrito');
    }

    return (
        <div className="cliente-pago-app">
            <Header />
            <div className="cliente-pago-fondo">
                <h2>PAGO</h2>
            </div>

            <div className="cliente-pago-principal">
                <div className="cliente-pago-parte-izquierda">
                    <div className="cliente-pago-direccion-envio">
                        <h3>Dirección de Envío</h3>
                        <div className="cliente-pago-direccion-envio-datos">
                            {direcciones.map((dir) => (
                                <label key={dir.id} className="cliente-pago-direccion-item">
                                    <input
                                        type="radio"
                                        name="direccion"
                                        value={dir.id}
                                        checked={direccion === dir.id}
                                        onChange={(e) => setDireccion(Number(e.target.value))}
                                    />
                                    {dir.id}
                                    {dir.otro}
                                    <div>{dir.latitud}, {dir.longitud}</div>

                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="cliente-pago-productos">
                        <h3>Productos</h3>
                        <div className="cliente-pago-productos-lista">
                            {carrito.map((producto, index) => (
                                <div key={index} className="cliente-pago-producto-item">
                                    <img src={producto.imagenPrincipal} alt={producto.nombre} />
                                    <p>{producto.nombre}</p>
                                    <p>
                                        {producto.tipoCompra === 'nuevo' ? (
                                            <>Nuevo: ${producto.precioNuevo} x {producto.cantidad}</>
                                        ) : (
                                            <>Recarga: ${producto.precioRecarga} x {producto.cantidad}</>
                                        )}
                                    </p>
                                    {/** <p>
                                        ${producto.tipoCompra === 'nuevo'
                                            ? producto.precioNuevo * producto.cantidad
                                            : producto.precioRecarga * producto.cantidad}
                                    </p>
                                    */}

                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="cliente-pago-metodos">
                        <h3>Métodos de Pago</h3>
                        <label className="cliente-pago-metodo-item">
                            <input type="radio" name="metodoPago" value="efectivo" onChange={handleMetodoPagoChange} />
                            Efectivo
                        </label>

                        <label className="cliente-pago-metodo-item">
                            <input type="radio" name="metodoPago" value="tarjeta" checked={metodoPago === "tarjeta"} onChange={handleMetodoPagoChange} />
                            Tarjeta de Crédito
                        </label>

                        {metodoPago === "tarjeta" && tarjetasCredito.length > 0 && (
                            <div className="cliente-pago-tarjetas">
                                {tarjetasCredito.map((tarjeta, index) => (
                                    <label key={index} className="cliente-pago-tarjeta-item">
                                        <input type="radio" name="tarjeta" value={tarjeta.id} onChange={handleTarjetaSeleccionada} />
                                        <strong>{tarjeta.tipoTarjeta}: </strong> ****** {tarjeta.numeroTarjeta.slice(-4)}
                                    </label>
                                ))}
                                <label className="cliente-pago-tarjeta-item">
                                    <input type="radio" name="tarjeta" value="nueva" onChange={() => setMostrarAgregarTarjeta(true)} />
                                    <span className="agregar-tarjeta">+ Agregar nueva tarjeta</span>
                                </label>
                            </div>
                        )}


                    </div>
                </div>

                <div className="cliente-pago-detalles">
                    <div className="cliente-pago-resumen">
                        <h3>RESUMEN</h3>
                        <div className="cliente-pago-resumen-detalle">
                            <p>Subtotal: <span> ${calcularTotal()}</span></p>
                            <p>Tarifa de envío: <span> $0.50</span></p>
                            <p>Total: <span> ${calcularTotal() + 0.50}</span></p>
                        </div>
                        <button className="cliente-pago-btn-pagar" onClick={handleConfirmarPago}>
                            PAGAR
                        </button>
                        <p className="cliente-pago-nota-privacidad">
                            Sus datos personales se utilizarán para respaldar su experiencia en este sitio web, para administrar el acceso a su cuenta y para otros fines descritos en nuestra política de privacidad.
                        </p>
                    </div>
                </div>
            </div>

            {mostrarAgregarTarjeta && (
                <AgregarTarjeta onClose={cerrarVistaAgregarTarjeta} onAgregarTarjeta={handleAgregarTarjeta} />
            )}
            <div className="btn-atras">
                <button onClick={handleIrAtras}> &lt; Atrás</button>
            </div>

            <FooterCliente />

        </div>

    );
};

export default VistaPago;

