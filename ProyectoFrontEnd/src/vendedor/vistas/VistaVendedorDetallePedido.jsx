import React, { useState, useEffect } from "react";
import Header from "../../general/componentes/Header";
import { useUsuario } from '../../general/componentes/UsuarioContext';
import axios from "axios";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

const VistaVendedorDetallePedido = () => {

    const { usuario } = useUsuario();
    const [userData, setUserData] = useState({});
    const { id: idPedido } = useParams();
    const [pedido, setPedido] = useState({});
    const [direccion, setDireccion] = useState({});
    const [cliente, setCliente] = useState({});
    console.log("Id del pedido:", idPedido);

    useEffect(() => {
        if (usuario) {
            axios.get(`http://localhost:8000/usuario/${usuario.id}`)
                .then((response) => setUserData(response.data))
                .catch((error) => console.error('Error al obtener la información del vendedor:', error));

            axios.get(`http://localhost:8000/pedidos/${idPedido}`)
                .then(response => {
                    setPedido(response.data)
                    console.log("Pedido:",response.data);
                })
                .catch(error => {
                    console.error('Error al obtener el pedido:', error);
                    // Swal.fire('Error', 'Hubo un error al obtener el pedido. Intenta de nuevo.', 'error');
                });
        }
    }, [usuario, idPedido]);

    useEffect(() => {
        if (pedido) {
            if (pedido.DireccionEnvioId) {
                axios.get(`http://localhost:8000/direcciones-envio/${pedido.DireccionEnvioId}`)
                    .then(response => {
                        setDireccion(response.data);
                        console.log("direccion: ", response.data);
                    })
                    .catch(error => {
                        console.error('Error al obtener la dirección:', error);
                        // Swal.fire('Error', 'Hubo un error al obtener la información de la dirección. Intenta de nuevo.', 'error');
                    });
            }

            if (pedido.ClienteId) {
                axios.get(`http://localhost:8000/usuario/${pedido.ClienteId}`)
                    .then(response => setCliente(response.data))
                    .catch(error => {
                        console.error('Error al obtener la información del cliente:', error);
                        // Swal.fire('Error', 'Hubo un error al obtener la información del vendedor. Intenta de nuevo.', 'error');
                    });
            }
        }
    }, [pedido]);

    if (!usuario) {
        return <div>No se ha iniciado sesión.</div>;
    }

    const formatearFecha = (fecha) => {
        const date = new Date(fecha);
        return date.toLocaleDateString("es-ES");
    };

    const formatearHora = (fecha) => {
        const date = new Date(fecha);
        return date.toLocaleTimeString("es-ES");

    };


    return (
        <div>
            <Header />
            <div className="cliente-pedido-individual-app">

                <div className="cliente-pedido-individual-principal">
                    <div className="cliente-pedido-individual-info-vendedor">
                        <h3>Información del Vendedor:</h3>
                        <div className="cliente-pedido-individual-vendedor-card">
                            <img
                                src={userData.imagenPerfil ? `http://localhost:8000${userData.imagenPerfil}` : "https://cdn-icons-png.flaticon.com/256/3736/3736502.png"}
                                alt={userData.nombre}
                            />
                            <p className="cliente-pedido-individual-vendedor-nombre">{userData.nombre}</p>
                        </div>
                        <p><strong>Nombre:</strong> {userData.nombre}</p>
                        <p><strong>Correo Electronico:</strong> {userData.email}</p>
                        <p><strong>Número:</strong> {userData.telefono ? userData.telefono : "No tiene telefono asignado."}</p>
                    </div>

                    {pedido && (
                        <div className="cliente-pedido-individual-ambos">
                            <div className="cliente-pedido-individual-info-pedido">
                                <h2>Información del Pedido</h2>
                                <p><strong>Pedido ID:</strong> {pedido.id}</p>
                                <p><strong>Fecha:</strong> {formatearFecha(pedido.fechaCreacion)}</p>
                                <p><strong>Hora:</strong> {formatearHora(pedido.fechaCreacion)}</p>
                                <p><strong>Total:</strong> ${pedido.total || "0.00"}</p>
                                <p><strong>Estado Pago:</strong> {pedido.estadoPago}</p>
                            </div>

                            {/* Dirección de Envío */}
                            {direccion && (
                                <div className="cliente-pedido-individual-direccion-envio">
                                    <h3>Dirección de Envío</h3>
                                    <div className="cliente-pedido-individual-direccion-box">
                                        <p><strong>Dirección:</strong> {direccion.otro}</p>
                                        <p><strong>Latitud:</strong> {direccion.latitud}</p>
                                        <p><strong>Longitud:</strong> {direccion.longitud}</p>
                                        <p><strong>Código Postal:</strong> {direccion.codigoPostal}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}


                    {pedido && <p className="cliente-pedido-individual-estado-entrega"><strong>Estado de Entrega:</strong> {pedido.estado}</p>}


                    {cliente && (
                        <div className="cliente-pedido-individual-info-vendedor">
                            <h3>Información del Cliente:</h3>
                            <div className="cliente-pedido-individual-vendedor-card">
                                <img
                                    src={cliente.imagenPerfil ? `http://localhost:8000${cliente.imagenPerfil}` : "https://cdn-icons-png.flaticon.com/256/3736/3736502.png"}
                                    alt={cliente.nombre}
                                />
                                <p className="cliente-pedido-individual-vendedor-nombre">{cliente.nombre}</p>
                            </div>
                            <p><strong>Nombre:</strong> {cliente.nombre}</p>
                            <p><strong>Correo Electrónico:</strong> {cliente.email}</p>
                            <p><strong>Número:</strong> {cliente.telefono || "No tiene teléfono asignado."}</p>
                        </div>
                    )}


                    <div className="cliente-pedido-individual-mapa-container">
                        <iframe
                            title="Mapa"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509377!2d144.9537363155042!3d-37.81627974202151!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0x5045675218ce6e0!2sMelbourne%20VIC%2C%20Australia!5e0!3m2!1sen!2sus!4v1606894417741!5m2!1sen!2sus"
                            width="100%"
                            height="400"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                        ></iframe>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default VistaVendedorDetallePedido;
