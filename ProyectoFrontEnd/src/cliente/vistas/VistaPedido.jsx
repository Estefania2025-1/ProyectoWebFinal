import React, { useState, useEffect } from "react";
import axios from "axios";
import "./VistaPedido.css";
import FooterCliente from "../componentes/FooterCliente";
import Header from '../../general/componentes/Header';
import { useUsuario } from '../../general/componentes/UsuarioContext';
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";

const VistaPedido = () => {

    const { usuario } = useUsuario();
    const [pedidos, setPedidos] = useState([]);
    const [pedidosPorPagina, setPedidosPorPagina] = useState(10);
    const [paginaActual, setPaginaActual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const navigate = useNavigate();

    const cargarPedidos = () => {
        if (usuario) {
            axios.get(`http://localhost:8000/pedidos-cliente/${usuario.id}`)
                .then((response) => {
                    const totalPedidos = response.data.length;
                    const pedidosOrdenados = response.data.sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion));

                    setPedidos(pedidosOrdenados);
                    setTotalPaginas(Math.ceil(totalPedidos / pedidosPorPagina));
                })
                .catch((error) => {
                    console.error("Error al cargar los pedidos:", error);
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

    const handleVerPedido = (pedidoId) => {
        navigate(`/pedidoDetalle/${pedidoId}`);
    };

    return (
        <div className="cliente-pedido-app">
            <Header />
            <div className="cliente-pedido-fondo">
                <h2>PEDIDOS</h2>
            </div>
            <div className="cliente-pedido-principal">
                <table className="cliente-tabla-pedidos">
                    <thead>
                        <tr>
                            <th>Pedido ID</th>
                            <th>Fecha</th>
                            <th>Hora</th>
                            <th>Total</th>
                            <th>Estado</th>
                            <th>Estado Pago</th>
                            <th>Detalles</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pedidosParaMostrar.length > 0 ? (
                            pedidosParaMostrar.map((pedido, index) => (
                                <tr key={index}>
                                    <td className="cliente-numero-pedido-id">{pedido.id}</td>
                                    <td>{pedido.fechaCreacion ? formatearFecha(pedido.fechaCreacion) : "Fecha no disponible"}</td>
                                    <td>{pedido.fechaCreacion ? formatearHora(pedido.fechaCreacion) : "Hora no disponible"}</td>
                                    <td>${pedido.total || "0.00"}</td>
                                    <td>
                                        <span className={`cliente-estado-pedido ${pedido.estado.toLowerCase()}`}>
                                            {pedido.estado}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`cliente-estado-pago ${pedido.estado.toLowerCase()}`}>
                                            {pedido.estadoPago}
                                        </span>
                                    </td>
                                    <td className="cliente-mas-detalles" onClick={() => handleVerPedido(pedido.id)}>Ver mas detalles</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6">No se encontraron pedidos.</td>
                            </tr>
                        )}
                    </tbody>
                </table>


                <div className="cliente-seccion-paginacion">
                    <div className="cliente-mostrar-registros">
                        <label htmlFor="cliente-registros">Mostrando</label>
                        <select
                            id="cliente-registros"
                            className="cliente-select-registros"
                            value={pedidosPorPagina}
                            onChange={cambiarPedidosPorPagina}
                        >
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                        </select>
                        <span> de {pedidos.length}</span>
                    </div>

                    <div className="cliente-paginacion">
                        <button
                            className="cliente-boton-paginacion"
                            onClick={() => cambiarPagina(paginaActual - 1)}
                            disabled={paginaActual === 1}
                        >
                            &laquo;
                        </button>
                        {Array.from({ length: totalPaginas }, (_, index) => (
                            <button
                                key={index}
                                className={`cliente-boton-paginacion ${paginaActual === index + 1 ? 'activo' : ''}`}
                                onClick={() => cambiarPagina(index + 1)}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button
                            className="cliente-boton-paginacion"
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

export default VistaPedido;