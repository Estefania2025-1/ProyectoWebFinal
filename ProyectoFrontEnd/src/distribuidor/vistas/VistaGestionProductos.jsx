import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./VistaGestionProductos.css";
import Header from "../../general/componentes/Header";
// import EstadisticasProducto from "../componentes/EstadisticasProducto";
import { useUsuario } from "../../general/componentes/UsuarioContext";
import axios from "axios";
import Swal from 'sweetalert2';

const VistaGestionProductos = () => {

    const navigate = useNavigate();
    const { usuario } = useUsuario();
    const [productos, setProductos] = useState([]);
    const [error, setError] = useState(null);
    const [mensajeExito, setMensajeExito] = useState('');
    const [productosPorPagina, setProductosPorPagina] = useState(10);
    const [paginaActual, setPaginaActual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    const [nombre, setNombre] = useState("");
    const [tipo, setTipo] = useState("");
    const [subtipo, setSubtipo] = useState("");
    const [cantidad, setCantidad] = useState("");
    // const [precio, setPrecio] = useState("");
    const [precioNuevo, setPrecioNuevo] = useState("");
    const [precioRecarga, setPrecioRecarga] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [imagenPrincipal, setImagenPrincipal] = useState("");
    const [peso, setPeso] = useState("");

    const [mostrarFiltros, setMostrarFiltros] = useState(false);
    const [criterioOrden, setCriterioOrden] = useState("id");
    const [editando, setEditando] = useState(null);

    const tipos = [
        { tipo: "GLP en Cilindros", subtipos: ["Doméstico", "Comercial"] },
        { tipo: "GLP a Granel", subtipos: ["Residencial", "Industrial", "AgroIndustrial"] }
    ];
/*
    const [estadisticas, setEstadisticas] = useState({
        tipos: 0,
        totalProductos: 0,
        ganancias: 0,
        masVendido: { nombre: '', cantidad: 0 },
        stocks: { disponibles: 0, noDisponibles: 0 },
    });
*/
    useEffect(() => {
        if (usuario?.rol === "distribuidor") {
            axios.get(`http://localhost:8000/productos`, {
                headers: { Authorization: `Bearer ${usuario.token}` }
            })
                .then(response => {
                    const totalProductos = response.data.length;
                    setProductos(response.data);
                    setTotalPaginas(Math.ceil(totalProductos / productosPorPagina));
                    // calcularEstadisticas(productos);
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


    if (usuario?.rol !== "distribuidor") {
        return <p>No tienes permiso para ver esta página.</p>;
    }
/*
    const calcularEstadisticas = (productos) => {
        const tiposDistintos = new Set(productos.map(p => p.tipo));
        const totalProductos = productos.length;
        const ganancias = productos.reduce((total, producto) => total + parseFloat(producto.precioNuevo || 0), 0);
        const masVendido = productos.reduce((max, producto) => (producto.cantidad > max.cantidad ? producto : max), { cantidad: 0 });
        const stocks = productos.reduce((acc, producto) => {
            if (producto.cantidad > 0) acc.disponibles++;
            else acc.noDisponibles++;
            return acc;
        }, { disponibles: 0, noDisponibles: 0 });

        setEstadisticas({
            tipos: tiposDistintos.size,
            totalProductos,
            ganancias,
            masVendido,
            stocks
        });
    };
*/
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

    const manejarRegistroProducto = (e) => {
        e.preventDefault();

        if (!nombre || !tipo || !subtipo || !cantidad || !precioRecarga || !precioNuevo || !descripcion || !imagenPrincipal || !peso) {
            setError('Por favor complete todos los campos.');
            setMensajeExito('');
            return;
        }

        axios.post('http://localhost:8000/productos', { nombre, tipo, subtipo, cantidad, precioNuevo, precioRecarga, descripcion, imagenPrincipal, peso },
            {
                headers: { Authorization: `Bearer ${usuario.token}` }
            }
        )
            .then(response => {
                setProductos([...productos, response.data]);
                setMensajeExito('Producto agregado correctamente');
                setError('');
                setMostrarFormulario(false);
                setNombre("");
                setTipo("");
                setSubtipo("");
                setCantidad("");
                setPrecioNuevo("");
                setPrecioRecarga("");
                // setPrecio("");
                setDescripcion("");
                setImagenPrincipal("");
                setPeso("");
                Swal.fire('Éxito', 'Producto agregado exitosamente', 'success');
                
            })
            .catch(error => {
                setError('Hubo un problema con la creación del producto.');
                setMensajeExito('');
            });
    };


    // EDITAR
    const handleEditar = (producto) => {
        setEditando(producto);
        setNombre(producto.nombre);
        setTipo(producto.tipo);
        setSubtipo(producto.subtipo);
        setCantidad(producto.cantidad);
        // setPrecio(producto.precio);
        setPrecioNuevo(producto.precioNuevo);
        setPrecioRecarga(producto.precioRecarga);
        setDescripcion(producto.descripcion);
        setImagenPrincipal(producto.imagenPrincipal);
        setPeso(producto.peso);
    };

    const handleGuardarEdicion = (e) => {
        e.preventDefault();

        axios.put(`http://localhost:8000/productos/${editando.id}`, {
            nombre, tipo, subtipo, cantidad, precioNuevo, precioRecarga, descripcion, imagenPrincipal, peso
        }, {
            headers: { Authorization: `Bearer ${usuario.token}` }
        })
            .then(response => {
                setProductos(productos.map(p => p.id === editando.id ? response.data : p));
                setEditando(null);
                setMensajeExito("Producto actualizado exitosamente");
                Swal.fire('Éxito', 'Producto actualizado exitosamente', 'success');
            })
            .catch(() => {
                setError("Error al actualizar el producto");
            });
    };

    // ELIMINAR

    const handleEliminar = (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¡Esta acción eliminará el producto permanentemente!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`http://localhost:8000/productos/${id}`, {
                    headers: { Authorization: `Bearer ${usuario.token}` }
                })
                    .then(() => {
                        setProductos(productos.filter(p => p.id !== id));
                        setMensajeExito("Producto eliminado correctamente");
                        Swal.fire('Eliminado', 'El producto ha sido eliminado correctamente.', 'success');
                    })
                    .catch(() => {
                        setError("Error al eliminar el producto");
                        Swal.fire('Error', 'Hubo un problema al eliminar el producto.', 'error');
                    });
            } else {
                Swal.fire('Cancelado', 'La eliminación ha sido cancelada.', 'info');
            }
        });
    };

    const handleIrProducto = (id) => {
        const producto = productos.find(p => p.id === id);
        navigate(`/productoDistribuidor/${id}`);
    }

/**<EstadisticasProducto estadisticas={estadisticas}/> */
    return (
        <div className="distribuidor-inventario-app">
            <Header />
            <div className="distribuidor-inventario-principal">
                <div className="distribuidor-inventario-header">
                    <h2>Productos</h2>
                    <div className="distribuidor-inventario-action-buttons">
                        <button onClick={() => setMostrarFormulario(true)}> Agregar Productos</button>
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
                            <th>Editar</th>
                            <th>Borrar</th>
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
                                    <td className="distribuidor-inventario-editar" onClick={() => handleEditar(producto)}>Editar</td>
                                    <td className="distribuidor-inventario-eliminar" onClick={() => handleEliminar(producto.id)}>Borrar</td>
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
                        <select
                            id="distribuidor-registros"
                            className="distribuidor-select-registros"
                            value={productosPorPagina}
                            onChange={cambiarProductosPorPagina}
                        >
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                        </select>
                        <span> de {productos.length}</span>
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

            {mostrarFormulario && (
                <div className="distribuidor-inventario-form-overlay">
                    <div className="distribuidor-inventario-form-container">
                        <button className="cerrar-modal" onClick={() => setMostrarFormulario(false)}>×</button>
                        <h3>Agregar Producto</h3>
                        {error && <p className="error">{error}</p>}
                        {mensajeExito && <p className="exito">{mensajeExito}</p>}
                        <form onSubmit={manejarRegistroProducto}>
                            <label>Nombre</label>
                            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />


                            <label>Tipo</label>
                            <select value={tipo} onChange={(e) => {
                                setTipo(e.target.value);
                                setSubtipo(""); // Resetear subtipo cuando cambie el tipo
                            }} required>
                                <option value="">Seleccionar tipo</option>
                                {tipos.map((t, index) => (
                                    <option key={index} value={t.tipo}>{t.tipo}</option>
                                ))}
                            </select>

                            <label>Subtipo</label>
                            <select value={subtipo} onChange={(e) => setSubtipo(e.target.value)} required>
                                <option value="">Seleccionar subtipo</option>
                                {tipos
                                    .find(t => t.tipo === tipo)?.subtipos.map((st, index) => (
                                        <option key={index} value={st}>{st}</option>
                                    ))}
                            </select>

                            <label>Cantidad</label>
                            <input type="number" value={cantidad} onChange={(e) => setCantidad(e.target.value)} required />
                            <label>Precio Nuevo</label>
                            <input type="number" value={precioNuevo} onChange={(e) => setPrecioNuevo(e.target.value)} required />
                            <label>Precio Recarga</label>
                            <input type="number" value={precioRecarga} onChange={(e) => setPrecioRecarga(e.target.value)} required />
                            
                            <label>Peso</label>
                            <input type="number" value={peso} onChange={(e) => setPeso(e.target.value)} required />
                            <label>Descripción</label>
                            <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required />
                            <label>Imagen Principal</label>
                            <input type="text" value={imagenPrincipal} onChange={(e) => setImagenPrincipal(e.target.value)} required />
                            <button type="submit">Agregar Producto</button>
                            <button type="button" onClick={() => setMostrarFormulario(false)}>Cancelar</button>
                        </form>
                    </div>
                </div>
            )}

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

            {editando && (
                <div className="distribuidor-inventario-form-overlay">
                    <div className="distribuidor-inventario-form-container">
                        <button className="cerrar-modal" onClick={() => setEditando(null)}>×</button>
                        <h3>Editar Producto</h3>
                        {error && <p className="error">{error}</p>}
                        <form onSubmit={handleGuardarEdicion}>
                            <label>Nombre</label>
                            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />

                            <label>Tipo</label>
                            <select value={tipo} onChange={(e) => {
                                setTipo(e.target.value);
                                setSubtipo(""); // Resetear subtipo cuando cambie el tipo
                            }} required>
                                <option value="">Seleccionar tipo</option>
                                {tipos.map((t, index) => (
                                    <option key={index} value={t.tipo}>{t.tipo}</option>
                                ))}
                            </select>

                            <label>Subtipo</label>
                            <select value={subtipo} onChange={(e) => setSubtipo(e.target.value)} required>
                                <option value="">Seleccionar subtipo</option>
                                {tipos
                                    .find(t => t.tipo === tipo)?.subtipos.map((st, index) => (
                                        <option key={index} value={st}>{st}</option>
                                    ))}
                            </select>
                            <label>Cantidad</label>
                            <input type="number" value={cantidad} onChange={(e) => setCantidad(e.target.value)} required />
                            <label>Precio Nuevo</label>
                            <input type="number" value={precioNuevo} onChange={(e) => setPrecioNuevo(e.target.value)} required />
                            <label>Precio Recarga</label>
                            <input type="number" value={precioRecarga} onChange={(e) => setPrecioRecarga(e.target.value)} required />


                            <label>Peso</label>
                            <input type="number" value={peso} onChange={(e) => setPeso(e.target.value)} required />
                            <label>Descripción</label>
                            <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required />
                            <label>Imagen Principal</label>
                            <input type="text" value={imagenPrincipal} onChange={(e) => setImagenPrincipal(e.target.value)} />

                            <button type="submit">Guardar Cambios</button>
                            <button type="button" onClick={() => setEditando(null)}>Cancelar</button>
                        </form>
                    </div>
                </div>
            )}

            <footer className="distribuidor-footer"></footer>

        </div>
    );
};

export default VistaGestionProductos;


