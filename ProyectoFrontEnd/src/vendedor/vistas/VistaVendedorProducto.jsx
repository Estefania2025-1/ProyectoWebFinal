import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../general/componentes/Header";
import { useNavigate } from "react-router-dom";
import { useUsuario } from "../../general/componentes/UsuarioContext";
import Swal from 'sweetalert2';

const VistaVendedorProducto = () => {

    const navigate = useNavigate();
    const { usuario } = useUsuario();
    const [productos, setProductos] = useState([]);
    const [error, setError] = useState(null);
    const [productosPorPagina, setProductosPorPagina] = useState(10);
    const [paginaActual, setPaginaActual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
 

    const [mostrarFiltros, setMostrarFiltros] = useState(false);
    const [criterioOrden, setCriterioOrden] = useState("id");

    useEffect(() => {
        if (usuario?.rol === "vendedor") {
            axios.get(`http://localhost:8000/productos`, {
                headers: { Authorization: `Bearer ${usuario.token}` }
            })
                .then(response => {
                    const totalProductos = response.data.length;
                    setProductos(response.data);
                    setTotalPaginas(Math.ceil(totalProductos / productosPorPagina));
                })
                .catch(error => {
                    setError("No se pudieron cargar los productos.");
                });
        }
    }, [usuario]);


    useEffect(() => {
        if (productos.length > 0) {
            const productosOrdenados = [...productos].sort((a, b) => {
                if (criterioOrden === "nombre") {
                    return a.nombre.localeCompare(b.nombre);
                } else {
                    return a.id - b.id;
                }
            });
            setProductos(productosOrdenados);
        }
    }, [criterioOrden]);

    const productosParaMostrar = productos.slice(
        (paginaActual - 1) * productosPorPagina,
        paginaActual * productosPorPagina
    );

    const cambiarPagina = (pagina) => {
        if (pagina >= 1 && pagina <= totalPaginas) {
            setPaginaActual(pagina);
        }
    };

    const cambiarProductosPorPagina = (e) => {
        setProductosPorPagina(Number(e.target.value));
        setPaginaActual(1);
    };
/*
    const handleIrProducto = (id) => {
        const producto = productos.find(p => p.id === id);
        navigate(`/productoDistribuidor/${id}`);
    }
*/

    const handleIrProducto = (id) => {
        const producto = productos.find(p => p.id === id);
        navigate(`/vendedorProductoDetalle/${id}`);
    }

    return (
        <div className="distribuidor-inventario-app">
            <Header />
            <div className="distribuidor-inventario-principal">
                <div className="distribuidor-inventario-header">
                    <h2>Productos</h2>
                    <div className="distribuidor-inventario-action-buttons">
                        <button onClick={() => setMostrarFiltros(!mostrarFiltros)}> Filtros </button>
                        <button> Descargar </button>
                    </div>
                </div>
                <table className="distribuidor-inventario-tabla">
                    <thead>
                        <tr>
                            <th>Producto ID</th>
                            <th>Nombre</th>
                            <th>Tipo</th>
                            <th>Subtipo</th>
                            <th>Cantidad</th>
                            <th>Precio Nuevo</th>
                            <th>Precio Recarga</th>
                            <th>Estado</th>
                            <th>Detalles</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productosParaMostrar.length > 0 ? (
                            productosParaMostrar.map((producto) => (
                                <tr key={producto.id}>
                                    <td className="distribuidor-inventario-numero-id">{producto.id}</td>
                                    <td>{producto.nombre}</td>
                                    <td>{producto.tipo}</td>
                                    <td>{producto.subtipo}</td>
                                    <td>{producto.cantidad}</td>
                                    <td>${producto.precioNuevo}</td>
                                    <td>${producto.precioRecarga}</td>
                                    <td> {producto.disponibilidad} </td>
                                    <td className="distribuidor-inventario-mas-detalles" onClick={() => handleIrProducto(producto.id)}>Ver mas detalles</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6">No se encontraron Vendedores.</td>
                            </tr>
                        )}
                    </tbody>
                </table>


                <div className="distribuidor-seccion-paginacion">
                    <div className="distribuidor-mostrar-registros">
                        <label htmlFor="distribuidor-registros">Mostrando</label>
                        <select id="distribuidor-registros" className="distribuidor-select-registros" value={productosPorPagina} onChange={cambiarProductosPorPagina} >
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                        </select>
                        <span> de {productos.length}</span>
                    </div>

                    <div className="distribuidor-paginacion">
                        <button className="distribuidor-boton-paginacion" onClick={() => cambiarPagina(paginaActual - 1)} disabled={paginaActual === 1}>
                            &laquo;
                        </button>
                        {Array.from({ length: totalPaginas }, (_, index) => (
                            <button key={index} className={`distribuidor-boton-paginacion ${paginaActual === index + 1 ? 'activo' : ''}`} onClick={() => cambiarPagina(index + 1)} >
                                {index + 1}
                            </button>
                        ))}
                        <button className="distribuidor-boton-paginacion" onClick={() => cambiarPagina(paginaActual + 1)} disabled={paginaActual === totalPaginas} >
                            &raquo;
                        </button>
                    </div>
                </div>

            </div>

            {mostrarFiltros && (
                <div className="distribuidor-inventario-menu-filtros">
                    <p onClick={() => { setCriterioOrden("id"); setMostrarFiltros(false); }}>
                        Ordenar por ID (Predeterminado)
                    </p>
                    <p onClick={() => { setCriterioOrden("nombre"); setMostrarFiltros(false); }}>
                        Ordenar por Nombre (A-Z)
                    </p>
                </div>
            )}

            <footer className="distribuidor-footer"></footer>

        </div>
    );
};

export default VistaVendedorProducto;


