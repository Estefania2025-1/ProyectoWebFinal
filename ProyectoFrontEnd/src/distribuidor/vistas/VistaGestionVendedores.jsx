import React, { useState, useEffect } from "react";
import "./VistaGestionVendedores.css";
import Header from "../../general/componentes/Header";
import { useUsuario } from "../../general/componentes/UsuarioContext";
import axios from "axios";
import Swal from 'sweetalert2';
import AgregarVendedor from "../componentes/AgregarVendedor";
import { useNavigate } from "react-router-dom";

const VistaGestionVendedores = () => {

    const { usuario } = useUsuario();
    const [vendedores, setVendedores] = useState([]);
    const [error, setError] = useState(null);
    const [mensajeExito, setMensajeExito] = useState('');
    const [vendedoresPorPagina, setVendedoresPorPagina] = useState(10);
    const [paginaActual, setPaginaActual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [emailError, setEmailError] = useState('');
    const [emailValido, setEmailValido] = useState('');

    const [mostrarFiltros, setMostrarFiltros] = useState(false);
    const [criterioOrden, setCriterioOrden] = useState("id");

    const [editando, setEditando] = useState(null);
    const navigate = useNavigate();


    useEffect(() => {
        if (usuario?.rol === "distribuidor") {
            axios.get(`http://localhost:8000/vendedores`, {
                headers: { Authorization: `Bearer ${usuario.token}` }
            })
                .then(response => {
                    const totalVendedores = response.data.length;
                    setVendedores(response.data);
                    setTotalPaginas(Math.ceil(totalVendedores / vendedoresPorPagina));
                })
                .catch(error => {
                    setError("No se pudieron cargar los vendedores");
                });
        }
    }, [usuario]);


    useEffect(() => {
        if (vendedores.length > 0) {
            const vendedoresOrdenados = [...vendedores].sort((a, b) => {
                if (criterioOrden === "nombre") {
                    return a.nombre.localeCompare(b.nombre);
                } else {
                    return a.id - b.id;
                }
            });
            setVendedores(vendedoresOrdenados);
        }
    }, [criterioOrden]);


    if (usuario?.rol !== "distribuidor") {
        return <p>No tienes permiso para ver esta página.</p>;
    }

    const vendedoresParaMostrar = vendedores.slice(
        (paginaActual - 1) * vendedoresPorPagina,
        paginaActual * vendedoresPorPagina
    );

    const cambiarPagina = (pagina) => {
        if (pagina >= 1 && pagina <= totalPaginas) {
            setPaginaActual(pagina);
        }
    };

    const cambiarVendedoresPorPagina = (e) => {
        setVendedoresPorPagina(Number(e.target.value));
        setPaginaActual(1);
    };
    
    // EDITAR

    const handleEditar = (vendedor) => {
        setEditando(vendedor);
        setNombre(vendedor.nombre);
        setEmail(vendedor.email);
    };

    const handleGuardarEdicion = () => {
        axios.put(`http://localhost:8000/editarVendedor/${editando.id}`, { nombre, email }, {
            headers: { Authorization: `Bearer ${usuario.token}` }
        })
            .then(response => {
                setVendedores(vendedores.map(v => v.id === editando.id ? response.data : v));
                setEditando(null);
                setMensajeExito("Vendedor actualizado exitosamente");
                Swal.fire('Éxito', 'Vendedor actualizado exitosamente', 'success');
            })
            .catch(() => {
                setError("Error al actualizar el vendedor");
            });
    };
    // ELIMINAR

    const handleEliminar = (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¡Esta acción eliminará al vendedor permanentemente!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`http://localhost:8000/eliminarVendedor/${id}`, {
                    headers: { Authorization: `Bearer ${usuario.token}` }
                })
                    .then(() => {
                        setVendedores(vendedores.filter(v => v.id !== id));
                        setMensajeExito("Vendedor eliminado correctamente");
                        Swal.fire('Eliminado', 'El vendedor ha sido eliminado correctamente.', 'success');
                    })
                    .catch(() => {
                        setError("Error al eliminar el vendedor");
                        Swal.fire('Error', 'Hubo un problema al eliminar el vendedor.', 'error');
                    });
            } else {
                Swal.fire('Cancelado', 'La eliminación ha sido cancelada.', 'info');
            }
        });
    };

    const mapEstadoVendedor = (estado) => {
        if (estado === 'occupado') {
            return 'ocupado';
        } else if (estado === 'disponbile') {
            return 'disponible';
        }
        return estado;
    };

    const handleIrMapa = () => {
        navigate('/mapaVendedores');
    };

    //                         <button onClick={handleIrMapa}> Mapa </button>

    return (
        <div className="distribuidor-gestion-app">
            <Header />

            <div className="distribuidor-gestion-principal">
                <div className="distribuidor-gestion-header">
                    <h2>Vendedores</h2>
                    <div className="distribuidor-gestion-action-buttons">
                        <button onClick={() => setMostrarFormulario(true)}> Agregar </button>
                        <button onClick={() => setMostrarFiltros(!mostrarFiltros)}> Filtros </button>
                        <button> Descargar </button>
                    </div>
                </div>
                <table className="distribuidor-gestion-tabla">
                    <thead>
                        <tr>
                            <th>Vendedor ID</th>
                            <th>Nombre</th>
                            <th>email</th>
                            <th>Estado</th>
                            <th>Editar</th>
                            <th>Borrar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vendedoresParaMostrar.length > 0 ? (
                            vendedoresParaMostrar.map((vendedor) => (
                                <tr key={vendedor.id}>
                                    <td className="distribuidor-gestion-numero-id">{vendedor.id}</td>
                                    <td>{vendedor.nombre}</td>
                                    <td>{vendedor.email}</td>
                                    <td>{mapEstadoVendedor(vendedor.estadoVendedor)} </td>
                                    <td className="distribuidor-gestion-editar" onClick={() => handleEditar(vendedor)}>Editar</td>
                                    <td className="distribuidor-gestion-eliminar" onClick={() => handleEliminar(vendedor.id)}>Borrar</td>
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
                            value={vendedoresPorPagina}
                            onChange={cambiarVendedoresPorPagina}
                        >
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                        </select>
                        <span> de {vendedores.length}</span>
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
                <AgregarVendedor
                    usuario={usuario}
                    setVendedores={setVendedores}
                    setError={setError}
                    setMensajeExito={setMensajeExito}
                    setMostrarFormulario={setMostrarFormulario}
                    error={error}
                    mensajeExito={mensajeExito}
                />
            )}

            {mostrarFiltros && (
                <div className="distribuidor-menu-filtros">
                    <p onClick={() => { setCriterioOrden("id"); setMostrarFiltros(false); }}>
                        Ordenar por ID (Predeterminado)
                    </p>
                    <p onClick={() => { setCriterioOrden("nombre"); setMostrarFiltros(false); }}>
                        Ordenar por Nombre (A-Z)
                    </p>
                </div>
            )}

            {editando && (
                <div className="distribuidor-form-overlay">
                    <div className="distribuidor-form-container">
                        <button className="cerrar-modal" onClick={() => setEditando(null)}>×</button>
                        <h3>Editar Vendedor</h3>
                        <label>Nombre</label>
                        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                        <label>Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <button onClick={handleGuardarEdicion}>Guardar</button>
                    </div>
                </div>
            )}

            <footer className="distribuidor-footer"></footer>

        </div>

    )
};

export default VistaGestionVendedores;


/*
    const manejarRegistro = (e) => {
        e.preventDefault();

        if (!nombre || !email) {
            setError('Por favor complete todos los campos.');
            setMensajeExito('');
            return;
        }

        const passwordPredeterminada = "123456ingreso";
        const estadoVendedor = "disponbile";

        axios.post('http://localhost:8000/agregar-vendedor',
            { nombre, email, password: passwordPredeterminada, estadoVendedor },
            {
                headers: { Authorization: `Bearer ${usuario.token}` }
            }
        )
            .then(response => {
                setVendedores([...vendedores, response.data]);
                setMensajeExito('Se agregó correctamente un nuevo vendedor');
                setError('');
                setMostrarFormulario(false);
                setNombre("");
                setEmail("");
            })
            .catch(error => {
                if (error.response && error.response.data && error.response.data.message) {
                    setError(error.response.data.message);
                } else {
                    setError('Hubo un problema con la creación del vendedor.');
                }
                setMensajeExito('');
            });
    };
    

    const verificarCorreo = () => {
        if (email) {
            axios.post('http://localhost:8000/verificarEmailExiste', { email })
                .then(response => {
                    setEmailError('');
                    setEmailValido(response.data.message);
                })
                .catch(error => {
                    if (error.response && error.response.data) {
                        setEmailError(error.response.data.message);
                        setEmailValido('');
                    } else {
                        setEmailError('Hubo un problema al verificar el correo.');
                        setEmailValido('');
                    }
                });
        }
    };
    */
