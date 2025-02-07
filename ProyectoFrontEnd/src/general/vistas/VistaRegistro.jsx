//import logo from './logo.svg';
import './VistaRegistro.css';
import React, { useState } from "react";
import logo from '../../pictures/flama.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const VistaRegistro = () => {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmarPassword, setConfirmarPassword] = useState('');
    const [error, setError] = useState('');
    const [mensajeExito, setMensajeExito] = useState('');
    const [emailError, setEmailError] = useState('');
    const [emailValido, setEmailValido] = useState('');

    const navigate = useNavigate();

    const manejarRegistro = (e) => {
        e.preventDefault();

        if (!nombre || !email || !password || !confirmarPassword) {
            setError('Por favor complete todos los campos.');
            setMensajeExito('');
            return;
        }

        if (password !== confirmarPassword) {
            setError('Las contraseñas no coinciden.');
            setMensajeExito('');
            return;
        }

        if (password.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres.');
            setMensajeExito('');
            return;
        }

        axios.post('http://localhost:8000/registrar', { nombre, email, password})
            .then(response => {
                setMensajeExito('Registro exitoso. ¡Bienvenido!');
                setError('');
                navigate('/');
            })
            .catch(error => {
                if (error.response && error.response.data && error.response.data.message) {
                    setError(error.response.data.message);
                } else {
                    setError('Hubo un problema con el registro.');
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
        <div className="registro-aplicacion">
            <div className="registro-contenedor">
                <div className="registro-logo-contenedor">
                    <img src={logo} alt="Logo" className="registro-logo" />
                </div>
                <h1 className="registro-nombre-aplicacion">APP_NAME</h1>
                <form className="registro-formulario" onSubmit={manejarRegistro}>
                    <div className="registro-campo">
                        <label>Nombre:</label>
                        <input
                            type="text"
                            placeholder="Ingrese su nombre de usuario"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                        />
                    </div>
                    <div className="registro-campo">
                        <label>Correo Electrónico:</label>
                        <input
                            type="email"
                            placeholder="Ingrese su correo electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onBlur={verificarCorreo}
                        />
                        {emailError && <p className="registro-error">{emailError}</p>}
                        {emailValido && <p className="registro-exito">{emailValido}</p>}
                    </div>
                    <div className="registro-campo">
                        <label>Contraseña:</label>
                        <input
                            type="password"
                            placeholder="Ingrese su contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="registro-campo">
                        <label>Confirme su contraseña:</label>
                        <input
                            type="password"
                            placeholder="Ingrese nuevamente la contraseña"
                            value={confirmarPassword}
                            onChange={(e) => setConfirmarPassword(e.target.value)}
                        />
                    </div>
                    {error && <p className="registro-error">{error}</p>}
                    {mensajeExito && <p className="registro-exito">{mensajeExito}</p>}
                    <button type="submit" className="registro-boton">REGISTRARSE</button>
                </form>
            </div>
        </div>
    );
};

export default VistaRegistro;


