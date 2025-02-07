import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useUsuario } from "../../general/componentes/UsuarioContext";
import "./VistaGestionPedido.css";
import Header from "../../general/componentes/Header";
import { useNavigate } from "react-router-dom";

const VistaGestionPedidos = () => {

    const { usuario } = useUsuario();
    const [pedidos, setPedidos] = useState([]);
    const [pedidosPorPagina, setPedidosPorPagina] = useState(10);
    const [paginaActual, setPaginaActual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [clientes, setClientes] = useState({});
    const [vendedores, setVendedores] = useState({});
    const navigate = useNavigate();

    const cargarPedidos = () => {
        if (usuario) {
            axios.get(`http://localhost:8000/pedidos`)
                .then((response) => {
                    const totalPedidos = response.data.length;
                    const pedidosOrdenados = response.data.sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion));

                    setPedidos(pedidosOrdenados);
                    setTotalPaginas(Math.ceil(totalPedidos / pedidosPorPagina));
                })
                .catch((error) => {
                    console.error("Error al cargar los pedidos:", error);
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
            axios.get(`http://localhost:8000/usuariosRol/vendedor`)
                .then((response) => {
                    const vendedoresMap = response.data.reduce((acc, vendedor) => {
                        acc[vendedor.id] = vendedor.nombre;
                        return acc;
                    }, {});
                    setVendedores(vendedoresMap);
                })
                .catch((error) => {
                    console.error("Error al cargar los vendedores:", error);
                });
            /**
             * axios.post(`http://localhost:8000/asignar-pedidos`)
        .then((response) => {
            console.log(response.data);
            cargarPedidos();
        })
        .catch((error) => {
            console.error("Error al cargar los vendedores:", error);
        });
             */

        }
    };

    useEffect(() => {
        cargarPedidos();
    }, [usuario]);

    useEffect(() => {
        const asignarPedidos = async () => {
            try {
                await axios.post(`http://localhost:8000/asignar-pedidos`);
                cargarPedidos(); // recarga los pedidos luego de asignar los vendedores
            } catch (error) {
                console.error("Error al asignar pedidos y cargar los vendedores:", error);
            }
        };

        asignarPedidos(); // Ejecutar la asignación cuando el componente se monte

    }, []);


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
        navigate(`/gestionPedidoDetalle/${pedidoId}`);
    };

    return (
        <div className="distribuidor-pedidos-app">
            <Header />
            <div className="distribuidor-pedidos-principal">
                <div className="distribuidor-pedidos-header">
                    <h2>PEDIDOS</h2>
                    <div className="distribuidor-pedidos-action-buttons">
                        <button> Filtros </button>
                        <button> Descargar </button>
                    </div>
                </div>
                <table className="distribuidor-pedidos-tabla">
                    <thead>
                        <tr>
                            <th>Pedido ID</th>
                            <th>Nombre Cliente</th>
                            <th>Fecha</th>
                            <th>Hora</th>
                            <th>Total</th>
                            <th>Estado</th>
                            <th>Vendedor Asignado</th>
                            <th>Detalles</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pedidosParaMostrar.length > 0 ? (
                            pedidosParaMostrar.map((pedido, index) => (
                                <tr key={index}>
                                    <td className="distribuidor-pedidos-numero-id">{pedido.id}</td>
                                    <td>{clientes[pedido.ClienteId] || "Nombre no disponible"}</td>
                                    <td>{pedido.fechaCreacion ? formatearFecha(pedido.fechaCreacion) : "Fecha no disponible"}</td>
                                    <td>{pedido.fechaCreacion ? formatearHora(pedido.fechaCreacion) : "Hora no disponible"}</td>
                                    <td>${pedido.total || "0.00"}</td>
                                    <td>
                                        <span className={`distribuidor-pedidos-estado ${pedido.estado.toLowerCase()}`}>
                                            {pedido.estado}
                                        </span>
                                    </td>
                                    <td>{vendedores[pedido.VendedorId] || "No asignado"}</td>
                                    <td className="distribuidor-pedidos-mas-detalles" onClick={() => handleVerPedido(pedido.id)}>Ver mas detalles</td>

                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6">No se encontraron Pedidos.</td>
                            </tr>
                        )}
                    </tbody>
                </table>


                <div className="distribuidor-seccion-paginacion">
                    <div className="distribuidor-mostrar-registros">
                        <label htmlFor="distribuidor-registros">Mostrando</label>
                        <select
                            id="distribuidor-registros"
                            className="distribuidor-select-registros"
                            value={pedidosPorPagina}
                            onChange={cambiarPedidosPorPagina}
                        >
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                        </select>
                        <span> de {pedidos.length}</span>
                    </div>

                    <div className="distribuidor-paginacion">
                        <button
                            className="distribuidor-boton-paginacion"
                            onClick={() => cambiarPagina(paginaActual - 1)}
                            disabled={paginaActual === 1}
                        >
                            &laquo;
                        </button>
                        {Array.from({ length: totalPaginas }, (_, index) => (
                            <button
                                key={index}
                                className={`distribuidor-boton-paginacion ${paginaActual === index + 1 ? 'activo' : ''}`}
                                onClick={() => cambiarPagina(index + 1)}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button
                            className="distribuidor-boton-paginacion"
                            onClick={() => cambiarPagina(paginaActual + 1)}
                            disabled={paginaActual === totalPaginas}
                        >
                            &raquo;
                        </button>
                    </div>
                </div>

            </div>
            <footer className="distribuidor-footer"></footer>

        </div>
    );
};

export default VistaGestionPedidos;