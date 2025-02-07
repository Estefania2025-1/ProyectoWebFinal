import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../../cliente/vistas/VistaClientePerfil.css";
import { useUsuario } from '../../general/componentes/UsuarioContext';
import Swal from 'sweetalert2';
import Header from "../../general/componentes/Header";

const VistaDistribuidorPerfil = () => {
    const { usuario } = useUsuario();
    const [userData, setUserData] = useState({});
    const [direcciones, setDirecciones] = useState([]);
    const [tarjetasCredito, setTarjetasCredito] = useState([]);
    const [telefono, setTelefono] = useState('');
    const [telefonoNuevo, setTelefonoNuevo] = useState('');
    const [imagenPerfil, setImagenPerfil] = useState('');
    const fileInputRef = useRef(null);

    const [isEditing, setIsEditing] = useState(false);
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [isEditingPassword, setIsEditingPassword] = useState(false);

    const [mostrarAgregarTarjeta, setMostrarAgregarTarjeta] = useState(false);
    const [mostrarFormularioDireccion, setMostrarFormularioDireccion] = useState(false);
    const [mostrarFormularioTelefono, setMostrarFormularioTelefono] = useState(false);

    const [nuevaDireccion, setNuevaDireccion] = useState("");
    const [latitud, setLatitud] = useState("");
    const [longitud, setLongitud] = useState("");
    const [codigoPostal, setCodigoPostal] = useState("");

    const [nuevoNombre, setNuevoNombre] = useState("");
    const [nuevoEmail, setNuevoEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState('');
    const [nuevaPassword, setNuevaPassword] = useState('');

    useEffect(() => {
        if (usuario) {
            axios.get(`http://localhost:8000/usuario/${usuario.id}`)
                .then((response) => {
                    setUserData(response.data);
                    setTelefono(response.data.telefono || "");
                })
                .catch((error) => {
                    console.error('Error al obtener la informacion del usuario', error);
                });

            axios.get(`http://localhost:8000/direcciones-envio-user/${usuario.id}`)
                .then((response) => {
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
        }
    }, [usuario]);

    if (!usuario) {
        return <div>No se ha iniciado sesión.</div>;
    }

    const handleEditarClick = () => {
        setIsEditing(true);
    };

    const handleCerrarClick = () => {
        setIsEditing(false);
    };

    const handleEditarEmail = () => {
        setIsEditingEmail(true);
    };

    const handleCerrarEmail = () => {
        setIsEditingEmail(false);
    };

    const handleActualizarEmail = () => {
        if (!nuevoEmail) {
            alert("Por favor, ingresa un correo válido.");
            return;
        }

        axios.put(`http://localhost:8000/usuario/actualizar-correo/${usuario.id}`, { email: nuevoEmail })
            .then(() => {
                setUserData({ ...userData, email: nuevoEmail });
                setIsEditingEmail(false);
                Swal.fire('Éxito', 'Correo actualizado con éxito.', 'success');
            })
            .catch((error) => {
                console.error("Error al actualizar el correo:", error);
                Swal.fire('Error', 'Hubo un error al actualizar el correo.', 'error');
            });
    };

    const handleEditarPassword = () => {
        setIsEditingPassword(true);
    };

    const handleCerrarPassword = () => {
        setIsEditingPassword(false);
    };

    const handleActualizarPassword = () => {
        if (!currentPassword || !nuevaPassword) {
            alert("Por favor, llena todos los campos de contraseña.");
            return;
        }

        axios.put(`http://localhost:8000/usuario/actualizar-password/${usuario.id}`,
            {
                currentPassword,
                newPassword: nuevaPassword
            },
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // <--- token en encabezado
                }
            }
        )
            .then(() => {
                setIsEditingPassword(false);
                Swal.fire('Éxito', 'Contraseña actualizada con éxito.', 'success');
            })
            .catch((error) => {
                console.error("Error al actualizar la contraseña:", error);
                Swal.fire('Error', 'Hubo un error al actualizar la contraseña.', 'error');
            });
    };

    const handleClickSubirImagen = () => {
        fileInputRef.current.click();
    };

    const handleCambiarImagen = (e) => {
        const archivo = e.target.files[0];
        if (archivo) {
            const formData = new FormData();
            formData.append('imagenPerfil', archivo);

            const token = localStorage.getItem('token');
            if (!token) {
                alert("No se encuentra un token de autenticación. Por favor, inicia sesión.");
                return;
            }

            axios.post(`http://localhost:8000/usuario/subir-imagen/${usuario.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            })
                .then((response) => {
                    const updatedUserData = { ...userData, imagenPerfil: response.data.imagenPerfil };
                    setUserData(updatedUserData);

                    const imageUrl = `http://localhost:8000${response.data.imagenPerfil}?t=${new Date().getTime()}`;
                    setImagenPerfil(imageUrl);
                    Swal.fire('Éxito', 'Imagen de perfil actualizada con éxito.', 'success');
                })
                .catch((error) => {
                    console.error("Error al subir la imagen", error);
                    Swal.fire('Error', 'Hubo un error al actualizar la imagen. Intenta de nuevo.', 'error');
                });
        }
    };

    const handleGuardarTelefono = () => {
        if (!telefonoNuevo) {
            alert("Por favor, ingresa un teléfono válido.");
            return;
        }

        const telefonoData = {
            userId: usuario.id,
            telefono: telefonoNuevo
        };

        axios.put(`http://localhost:8000/usuario/actualizar-telefono/${usuario.id}`, telefonoData)
            .then(() => {
                setTelefono(telefonoNuevo);
                setMostrarFormularioTelefono(false);
                alert("Teléfono actualizado con éxito.");
            })
            .catch((error) => {
                console.error("Error al actualizar el teléfono:", error);
                alert("Hubo un error al actualizar el teléfono.");
            });
    };

    const handleCambiarTelefono = (e) => {
        setTelefonoNuevo(e.target.value);
    };

    const handleActualizarNombre = () => {
        if (!nuevoNombre) {
            alert("Por favor, ingresa un nombre válido.");
            return;
        }

        axios.put(`http://localhost:8000/usuario/actualizar-nombre/${usuario.id}`, { nombre: nuevoNombre })
            .then(() => {
                setUserData({ ...userData, nombre: nuevoNombre });
                setIsEditing(false);
                Swal.fire('Éxito', 'Nombre actualizado con éxito.', 'success');
            })
            .catch((error) => {
                console.error("Error al actualizar el nombre:", error);
                Swal.fire('Error', 'Hubo un error al actualizar el nombre.', 'error');
            });
    };

    return (
        <div className="vista-perfil-app">
            <Header />
            <div className="perfil-banner">
                <div className="perfil-imagen-container">
                    <img
                        className="perfil-foto"
                        src={
                            userData.imagenPerfil
                                ? `http://localhost:8000${userData.imagenPerfil}`
                                : "https://cdn-icons-png.flaticon.com/256/3736/3736502.png"
                        }
                        alt="Usuario"
                    />
                    <button className="perfil-boton-agregar" onClick={handleClickSubirImagen}>+</button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={handleCambiarImagen}
                        accept="image/*"
                    />
                </div>
                <h2>{userData.nombre}</h2>
            </div>

            <div className="vista-perfil-content">
                <div className="vista-perfil-datos">
                    <div className="perfil-informacion">
                        <h3>Información:</h3>
                        <div className="perfil-informacion-datos">
                            <p><strong>Nombre de Usuario:</strong> {userData.nombre}</p>
                            <p><strong>Correo:</strong> {userData.email}</p>
                            <p><strong>Password:</strong> {userData.password ? '●'.repeat(10) : 'No definida'}</p>
                            <p>
                                <strong>Teléfono:</strong>
                                {telefono ? (
                                    <span>{telefono}</span>
                                ) : (
                                    <span>No tiene teléfono asignado</span>
                                )}
                                {!telefono && (
                                    <button onClick={() => setMostrarFormularioTelefono(true)}>Agregar</button>
                                )}
                            </p>
                        </div>
                        <div className="perfil-informacion-btn-editar">
                            <button className="perfil-editar-btn" onClick={handleEditarClick}>
                                EDITAR NOMBRE
                            </button>
                            <button className="perfil-editar-btn" onClick={handleEditarEmail}>
                                EDITAR EMAIL
                            </button>
                            <button className="perfil-editar-btn" onClick={handleEditarPassword}>
                                EDITAR PASSWORD
                            </button>
                        </div>

                        <div className="perfil-campos-editar">

                            <div className="perfil-campo-editar-individual">

                                {isEditing && (
                                    <div className="perfil-informacion-editar">
                                        <form onSubmit={(e) => e.preventDefault()}>
                                            <input
                                                type="text"
                                                placeholder="Nombre de Usuario"
                                                value={nuevoNombre}
                                                onChange={(e) => setNuevoNombre(e.target.value)}
                                            />
                                        </form>
                                        <button className="perfil-editar-btn-confirmar" onClick={handleActualizarNombre}>
                                            CONFIRMAR
                                        </button>
                                        <button
                                            className="perfil-editar-btn-cerrar"
                                            onClick={handleCerrarClick}
                                        >
                                            CERRAR
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="perfil-campo-editar-individual">
                                {isEditingEmail && (
                                    <div className="perfil-informacion-editar">
                                        <form onSubmit={(e) => e.preventDefault()}>
                                            <input
                                                type="email"
                                                placeholder="Nuevo Correo"
                                                value={nuevoEmail}
                                                onChange={(e) => setNuevoEmail(e.target.value)}
                                            />
                                        </form>
                                        <button className="perfil-editar-btn-confirmar" onClick={handleActualizarEmail}>
                                            CONFIRMAR
                                        </button>
                                        <button
                                            className="perfil-editar-btn-cerrar"
                                            onClick={handleCerrarEmail}
                                        >
                                            CERRAR
                                        </button>
                                    </div>
                                )}
                            </div>


                            <div className="perfil-campo-editar-individual">
                                {isEditingPassword && (
                                    <div className="perfil-informacion-editar">
                                        <form onSubmit={(e) => e.preventDefault()}>
                                            <input
                                                type="password"
                                                placeholder="Contraseña actual"
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                            />
                                            <input
                                                type="password"
                                                placeholder="Nueva contraseña"
                                                value={nuevaPassword}
                                                onChange={(e) => setNuevaPassword(e.target.value)}
                                            />
                                        </form>
                                        <button className="perfil-editar-btn-confirmar" onClick={handleActualizarPassword}>
                                            CONFIRMAR
                                        </button>
                                        <button
                                            className="perfil-editar-btn-cerrar"
                                            onClick={handleCerrarPassword}
                                        >
                                            CERRAR
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>



                        {mostrarFormularioTelefono && (
                            <div className="perfil-agregar-telefono-formulario">
                                <h4>Agregar Teléfono</h4>
                                <input
                                    type="text"
                                    value={telefonoNuevo}
                                    onChange={handleCambiarTelefono}
                                    placeholder="Ingresa tu número de teléfono"
                                />
                                <div className="perfil-agregar-telefono-botones">
                                    <button onClick={handleGuardarTelefono}>Guardar</button>
                                    <button onClick={() => setMostrarFormularioTelefono(false)}>Cancelar</button>
                                </div>
                            </div>
                        )}
                    </div>


                </div>
            </div>
        </div>
    );
};

export default VistaDistribuidorPerfil;