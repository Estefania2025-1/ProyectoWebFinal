import React, { useState, useEffect } from 'react';
import './VistaIngresos.css';
import logo from '../../pictures/flama.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUsuario } from '../componentes/UsuarioContext';

const VistaIngresos = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [mensajeExito, setMensajeExito] = useState('');

    const navigate = useNavigate();
    const {login} = useUsuario(); // acceso al metodo login del contexto

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/login', { email: email, password });
            const { token, id, rol } = response.data;
            login(token, id, rol);
            // const token = response.data.token;
            console.log("El ID y ROL es:", id, rol);
            // localStorage.setItem('token', token);

            if (rol === 'cliente') {
                navigate('/menuCliente');
            } else if (rol === 'vendedor') {
                navigate('/menuVendedor');
            } else if (rol === 'distribuidor') {
                navigate('/menuDistribuidor');
            }

            // navigate('/sobreNosotros');
        } catch (error) {
            setError('Correo o contraseña incorrectos');
        }
    };

    const handleRegistrar = () => {
        navigate('/registrar');
    };

    return (
        <div className="ingreso-aplicacion">
            <div className="ingreso-contenedor-login">
                <div className="ingreso-contenedor-logo">
                    <img src={logo} alt="Logo" className="ingreso-logo" />
                </div>
                <h1 className="ingreso-nombre-aplicacion">DELIVERY GAS</h1>
                <div className="ingreso-formulario-login">
                    <div className="ingreso-usuario">
                        <label>Correo:</label>
                        <input
                            type="text"
                            placeholder="Ingrese su correo"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="ingreso-password">
                        <label>Contraseña:</label>
                        <input
                            type="password"
                            placeholder="Ingrese su contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>
                {error && <p className="ingreso-error-mensaje">{error}</p>}
                <div>
                    <button className="ingreso-boton-ingresar" onClick={handleSubmit}>
                        INGRESAR
                    </button>
                </div>
                <div className="ingreso-contenedor-crear-cuenta">
                    <p>¿No tiene una cuenta?</p>
                    <a onClick={handleRegistrar} >Cree una cuenta</a>
                </div>
                <footer className="ingreso-pie-de-pagina">
                    Derechos Reservados (C) - 2024-2025
                </footer>
            </div>
            <div className="ingreso-contenedor-imagen">
                <img
                    src="https://www.camaraofespanola.org/files/Afiliados/Images/Duragas.jpg"
                    alt="Imagen de fondo"
                />
            </div>
        </div>
    );
};

export default VistaIngresos;
