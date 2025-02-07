import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import Header from "../../general/componentes/Header";
import "./VistaMapaVendedores.css";
import axios from "axios";
import { useUsuario } from "../../general/componentes/UsuarioContext";
import Swal from 'sweetalert2';
import L from 'leaflet';

const icon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/256/3736/3736502.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const VistaMapaVendedores = () => {
    const { usuario } = useUsuario();
    const [vendedores, setVendedores] = useState([]);
    const [ubicaciones, setUbicaciones] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [vendedoresFiltrados, setVendedoresFiltrados] = useState([]);

    useEffect(() => {
        if (usuario?.rol === "distribuidor") {
            axios.get('http://localhost:8000/ubicaciones-vendedor', {
                headers: { Authorization: `Bearer ${usuario.token}` }
            })
                .then(response => {
                    setUbicaciones(response.data);
                })
                .catch(error => {
                    Swal.fire('Error', 'Hubo un problema al cargar las ubicaciones de los vendedores.', 'error');
                });

            axios.get(`http://localhost:8000/vendedores`, {
                headers: { Authorization: `Bearer ${usuario.token}` }
            })
                .then(response => {
                    const totalVendedores = response.data.length;
                    setVendedores(response.data);
                    setVendedoresFiltrados(response.data);
                })
                .catch(error => {
                    Swal.error('Error', 'Hubo un problema al cargar los vendedores.', 'error');
                });
        }
    }, [usuario]);

    useEffect(() => {
        if (busqueda.trim() === "") {
            setVendedoresFiltrados(vendedores);
        } else {
            const vendedoresFiltrados = vendedores.filter(vendedor =>
                vendedor.nombre.toLowerCase().includes(busqueda.toLowerCase())
            );
            setVendedoresFiltrados(vendedoresFiltrados);
        }
    }, [busqueda, vendedores]);

    if (usuario?.rol !== "distribuidor") {
        return <p>No tienes permiso para ver esta página.</p>;
    }

    const mapEstadoVendedor = (estado) => {
        if (estado === 'occupado') {
            return 'ocupado';
        } else if (estado === 'disponbile') {
            return 'disponible';
        }
        return estado;
    };

    return (
        <div className="distribuidor-mapa-app">
            <Header />
            <div className="distribuidor-mapa-principal">
                <div className="distribuidor-mapa-busqueda-container">
                    <label htmlFor="busqueda">Búsqueda:</label>
                    <input type="text" id="busqueda" placeholder="Ingrese el nombre del vendedor" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
                </div>
                <div className="distribuidor-mapa-contenido">
                    <div className="distribuidor-mapa-vendedores-container">
                        <h2>Vendedores:</h2>
                        <div className="distribuidor-mapa-vendedores-grid">
                            {vendedoresFiltrados.length > 0 ? (
                                vendedoresFiltrados.map(vendedor => (
                                    <div key={vendedor.id} className="distribuidor-mapa-vendedor-card">
                                        <img src={vendedor.imagenPerfil ? vendedor.imagenPerfil : "https://cdn-icons-png.flaticon.com/256/3736/3736502.png"} alt={vendedor.nombre} />
                                        <div className="distribuidor-mapa-vendedor-info">
                                            <h3>{vendedor.nombre}</h3>
                                            <p>{vendedor.email}</p>
                                            <span className="distribuidor-mapa-estado">{mapEstadoVendedor(vendedor.estadoVendedor)}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No se encontraron vendedores que coincidan con esa búsqueda.</p>
                            )}
                        </div>
                    </div>
                    <div className="distribuidor-mapa-container">
                        <MapContainer center={[-0.1807, -78.4678]} zoom={12} style={{ height: "100%", width: "100%" }}>
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            {ubicaciones.map((ubicacion) => (
                                <Marker key={ubicacion.id} position={[ubicacion.latitud, ubicacion.longitud]} icon={icon} style={{ height: "100%", width: "100%" }}>
                                    <Popup>
                                        <div>
                                            <h3>Vendedor</h3>
                                            <p><strong>Dirección:</strong> {ubicacion.otro}</p>
                                            <p><strong>Latitud:</strong> {ubicacion.latitud}</p>
                                            <p><strong>Longitud:</strong> {ubicacion.longitud}</p>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VistaMapaVendedores;