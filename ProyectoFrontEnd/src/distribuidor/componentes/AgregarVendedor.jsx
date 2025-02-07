import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./AgregarVendedor.css";

const AgregarVendedor = ({ usuario, setVendedores, setError, setMensajeExito, setMostrarFormulario, error, mensajeExito }) => {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [emailValido, setEmailValido] = useState('');

    const generarUbicacionAleatoria = () => {
        const latitud = (Math.random() * 0.1) - 0.25;
        const longitud = (Math.random() * 0.3) - 78.65;
        return { latitud, longitud };
    };

    const obtenerDireccionCompleta = async (latitud, longitud) => {
        try {
            const response = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
                params: {
                    lat: latitud,
                    lon: longitud,
                    format: 'json',
                    addressdetails: 1,
                },
            });
            console.log(response.data.display_name);
            return response.data.display_name;
        } catch (error) {
            console.error('Error al obtener la dirección:', error);
            return null;
        }
    };

    const manejarRegistro = async(e) => {
        e.preventDefault();

        if (!nombre || !email) {
            setError('Por favor complete todos los campos.');
            setMensajeExito('');
            return;
        }

        const passwordPredeterminada = '123456ingreso';
        const estadoVendedor = 'disponbile';

        const { latitud, longitud } = generarUbicacionAleatoria();
        const otro = await obtenerDireccionCompleta(latitud, longitud);
        const codigoPostal = '170150';
        const timestamp = new Date().toISOString();

        axios.post('http://localhost:8000/agregar-vendedor',
            { nombre, email, password: passwordPredeterminada, estadoVendedor },
            { headers: { Authorization: `Bearer ${usuario.token}` } }
        )
            .then(response => {
                const vendedorId = response.data.id;

                // Crear la ubicación en UbicacionVendedor
                axios.post('http://localhost:8000/ubicaciones-vendedor', {
                    latitud,
                    longitud,
                    codigoPostal,
                    timestamp,
                    otro,
                    VendedorId: vendedorId
                })
                    .then(() => {
                        setVendedores(prevVendedores => [...prevVendedores, response.data]);
                        console.log('Vendedor registrado:', response.data);
                        Swal.fire('Éxito', 'Se agregó correctamente un nuevo vendedor y su ubicación', 'success');
                        // setMensajeExito('Se agregó correctamente un nuevo vendedor');
                        // setError('');
                        setMostrarFormulario(false);
                        setMensajeExito('');
                    })
                    .catch(error => {
                        setError('Hubo un problema al registrar la ubicación del vendedor.');
                    });
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

    return (
        <div className="distribuidor-form-overlay">
            <div className="distribuidor-form-container">
                <button className="cerrar-modal" onClick={() => setMostrarFormulario(false)}>×</button>
                <h3>Agregar Vendedor</h3>
                {error && <p className="error">{error}</p>}
                {mensajeExito && <p className="exito">{mensajeExito}</p>}
                <form onSubmit={manejarRegistro}>
                    <label>Nombre</label>
                    <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={verificarCorreo} required />
                    {emailError && <p className="error">{emailError}</p>}
                    {emailValido && <p className="exito">{emailValido}</p>}
                    <label>Contraseña</label>
                    <input type="password" value={"123456ingreso"} disabled />
                    <button type="submit">Agregar</button>
                    <button type="button" onClick={() => setMostrarFormulario(false)}>Cancelar</button>
                </form>
            </div>
        </div>
    );
};

export default AgregarVendedor;







