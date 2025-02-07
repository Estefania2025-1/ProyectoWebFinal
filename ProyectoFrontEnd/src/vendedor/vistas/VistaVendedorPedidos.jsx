import React, { useState, useEffect } from "react";
import axios from "axios";
import "./VistaVendedorPedidos.css";
import FooterCliente from "../../cliente/componentes/FooterCliente";
import Header from "../../general/componentes/Header";
import { useUsuario } from "../../general/componentes/UsuarioContext";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const VistaVendedorPedidos = () => {
    const { usuario } = useUsuario();
    const [pedidos, setPedidos] = useState([]);
    const [pedidosPorPagina, setPedidosPorPagina] = useState(10);
    const [paginaActual, setPaginaActual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [clientes, setClientes] = useState({});
    const navigate = useNavigate();

    const cargarPedidos = () => {
        if (usuario && usuario.rol === "vendedor") {
            axios.get(`http://localhost:8000/pedidos-vendedor/${usuario.id}`)
                .then((response) => {
                    const totalPedidos = response.data.length;
                    const pedidosOrdenados = response.data.sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion));

                    setPedidos(pedidosOrdenados);
                    setTotalPaginas(Math.ceil(totalPedidos / pedidosPorPagina));
                })
                .catch((error) => {
                    console.error("Error al cargar los pedidos del vendedor:", error);
                });
            axios.get(`http://localhost:8000/usuariosRol/cliente`)

                .then((response) => {
                    const clientesMap = response.data.reduce((acc, cliente) => {
                        acc[cliente.id] = cliente.nombre;
                        return acc;
                    }, {});
                    setClientes(clientesMap);
                })
                .catch((error) => {
                    console.error("Error al cargar los clientes:", error);
                });
        }
    };

    useEffect(() => {
        cargarPedidos();
    }, [usuario]);

    const formatearFecha = (fecha) => {
        const date = new Date(fecha);
        return date.toLocaleDateString("es-ES");
    };

    const formatearHora = (fecha) => {
        const date = new Date(fecha);
        return date.toLocaleTimeString("es-ES");
    };

    const pedidosParaMostrar = pedidos.slice(
        (paginaActual - 1) * pedidosPorPagina,
        paginaActual * pedidosPorPagina
    );

    const cambiarPagina = (pagina) => {
        if (pagina >= 1 && pagina <= totalPaginas) {
            setPaginaActual(pagina);
        }
    };

    const cambiarPedidosPorPagina = (e) => {
        setPedidosPorPagina(Number(e.target.value));
        setPaginaActual(1);
    };

    const manejarAceptarPedido = (pedidoId) => {
        Swal.fire({
            title: '¿Estás seguro de aceptar este pedido?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.put(`http://localhost:8000/pedidos/${pedidoId}`, { estado: "en camino" })
                    .then(() => {
                        cargarPedidos(); // Recargar los pedidos después de actualizar
                        Swal.fire('Pedido Aceptado', '', 'success');
                    })
                    .catch((error) => {
                        console.error("Error al aceptar el pedido:", error);
                    });
            }
        });
    };

    const manejarEntregarPedido = (pedidoId, estadoPago) => {
        if (estadoPago === "pagado") {
            Swal.fire({
                title: '¿Estás seguro de que el pedido ha sido entregado?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Entregado',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    axios.put(`http://localhost:8000/pedidos/${pedidoId}`, { estado: "entregado" })
                        .then(() => {
                            cargarPedidos();
                            Swal.fire('Pedido Entregado', '', 'success');
                        })
                        .catch((error) => {
                            console.error("Error al entregar el pedido:", error);
                        });
                }
            });
        } else if (estadoPago === "pendiente") {
            Swal.fire({
                title: '¿El cliente pagó en efectivo?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Sí, pagó',
                cancelButtonText: 'No, vuelve a pendiente'
            }).then((result) => {
                if (result.isConfirmed) {
                    axios.put(`http://localhost:8000/pedidos/${pedidoId}`, { estado: "entregado", estadoPago: "pagado" })
                        .then(() => {
                            cargarPedidos();
                            Swal.fire('Pedido Entregado', '', 'success');
                        })
                        .catch((error) => {
                            console.error("Error al entregar el pedido:", error);
                        });
                } else {
                    axios.put(`http://localhost:8000/pedidos/${pedidoId}`, { estado: "pendiente" })
                        .then(() => {
                            cargarPedidos();
                            Swal.fire('Estado actualizado a pendiente', '', 'info');
                        })
                        .catch((error) => {
                            console.error("Error al cambiar a pendiente:", error);
                        });
                }
            });
        }
    };

    const handleIrPedido = (pedidoId) => {
        navigate(`/vendedorPedidoDetalle/${pedidoId}`);
    };

    return (
        <div className="vendedor-pedido-app">
            <Header />
            <div className="vendedor-pedido-fondo">
                <h2>PEDIDOS</h2>

            </div>
            <div className="vendedor-pedido-principal">
                <div className="distribuidor-pedidos-action-buttons">
                    <button> Descargar </button>
                </div>
                <table className="vendedor-tabla-pedidos">
                    <thead>
                        <tr>
                            <th>Pedido ID</th>
                            <th>Nombre Cliente</th>
                            <th>Fecha</th>
                            <th>Hora</th>
                            <th>Total</th>
                            <th>Estado</th>
                            <th>Estado Pago</th>
                            <th>Detalles</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pedidosParaMostrar.length > 0 ? (
                            pedidosParaMostrar.map((pedido, index) => (
                                <tr key={index}>
                                    <td className="vendedor-numero-pedido-id">{pedido.id}</td>
                                    <td>{clientes[pedido.ClienteId] || "Nombre no disponible"}</td>
                                    <td>{pedido.fechaCreacion ? formatearFecha(pedido.fechaCreacion) : "Fecha no disponible"}</td>
                                    <td>{pedido.fechaCreacion ? formatearHora(pedido.fechaCreacion) : "Hora no disponible"}</td>
                                    <td>${pedido.total || "0.00"}</td>
                                    <td>
                                        <span className={`vendedor-estado ${pedido.estado.toLowerCase()}`}>
                                            {pedido.estado}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`vendedor-estado-pago ${pedido.estadoPago.toLowerCase()}`}>
                                            {pedido.estadoPago}
                                        </span>
                                    </td>
                                    <td className="vendedor-mas-detalles" onClick={() => handleIrPedido(pedido.id)}>Ver más detalles</td>
                                    <td>
                                        {(pedido.estado === "pendiente" || pedido.estado === "confirmado")&& (
                                            <button className="vendedor-boton-aceptar" onClick={() => manejarAceptarPedido(pedido.id)}>Aceptar</button>
                                        )}
                                        {pedido.estado === "en camino" && (
                                            <button className="vendedor-boton-entregado" onClick={() => manejarEntregarPedido(pedido.id, pedido.estadoPago)}>Entregado</button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7">No se encontraron pedidos.</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div className="vendedor-seccion-paginacion">
                    <div className="vendedor-mostrar-registros">
                        <label htmlFor="vendedor-registros">Mostrando</label>
                        <select
                            id="vendedor-registros"
                            className="vendedor-select-registros"
                            value={pedidosPorPagina}
                            onChange={cambiarPedidosPorPagina}
                        >
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                        </select>
                        <span> de {pedidos.length}</span>
                    </div>

                    <div className="vendedor-paginacion">
                        <button
                            className="vendedor-boton-paginacion"
                            onClick={() => cambiarPagina(paginaActual - 1)}
                            disabled={paginaActual === 1}
                        >
                            &laquo;
                        </button>
                        {Array.from({ length: totalPaginas }, (_, index) => (
                            <button
                                key={index}
                                className={`vendedor-boton-paginacion ${paginaActual === index + 1 ? 'activo' : ''}`}
                                onClick={() => cambiarPagina(index + 1)}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button
                            className="vendedor-boton-paginacion"
                            onClick={() => cambiarPagina(paginaActual + 1)}
                            disabled={paginaActual === totalPaginas}
                        >
                            &raquo;
                        </button>
                    </div>
                </div>
            </div>
            <FooterCliente />
        </div>
    );
};

export default VistaVendedorPedidos;
