import React, { useState, useEffect } from "react";
import Header from "../../general/componentes/Header";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const VistaVendedorDetalleProducto = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [producto, setProducto] = useState({});
    const [error, setError] = useState(null);

    console.log('ID del producto:', id);

    const buscarProducto = () => {
        axios.get(`http://localhost:8000/productos/${id}`)
            .then(response => {
                setProducto(response.data);
                setError(null);
            })
            .catch(error => {
                console.error('Error al obtener el producto:', error);
                setError('Producto no encontrado');
            });
    };

    useEffect(() => {
        buscarProducto();
    }, [id]);


    console.log('Producto obtenido:', producto);

    const handleIrAtras = () => {
        navigate('/productoVendedor');
    }

    return (
        <div className="distribuidor-producto-app">
            <Header />

            <div className="distribuidor-producto-principal">
                <div className="distribuidor-producto-header">
                    <h2>Detalles del Producto</h2>
                    <div className="distribuidor-producto-action-buttons">
                        <button>Descargar</button>
                    </div>
                </div>

                <div className="distribuidor-producto-detalles">
                    <div className="distribuidor-producto-izquierda">
                        <div className="detalles-primarios">
                            <h3>Detalles Primarios</h3>
                            <p><strong>Nombre del Producto:</strong> {producto.nombre}</p>
                            <p><strong>Producto ID:</strong> {producto.id}</p>
                            <p><strong>Tipo:</strong> {producto.tipo}</p>
                            <p><strong>Subtipo:</strong> {producto.subtipo}</p>
                            <p><strong>Peso:</strong> {producto.peso} kg</p>
                            <p><strong>Valor Nuevo:</strong> ${producto.precioNuevo}</p>
                            <p><strong>Valor Recarga:</strong> ${producto.precioRecarga}</p>
                        </div>

                        <div className="detalles-secundarios">
                            <h3>Detalles Adicionales</h3>
                            <p><strong>Descripción Principal:</strong>{producto.descripcion}</p>
                            <p><strong>Información Adicional:</strong> ${producto.informacionAdicional}</p>
                        </div>

                    </div>
                    <div className="distribuidor-producto-derecha">
                        <h3>Producto:</h3>
                        <img src={producto.imagenPrincipal} alt={producto.nombre} />
                        <p><strong>Cantidad disponible:</strong> {producto.cantidad}</p>
                        <p><strong>Estado de Disponibilidad:</strong> {producto.disponibilidad}</p>
                        <p><strong>Precio de Recarga:</strong> ${producto.precioRecarga}</p>
                    </div>
                    <div className="distribuidor-imagenes-secundarias">
                        {producto.imagenesSecundarias && producto.imagenesSecundarias.length > 0 ? (
                            <div className="galeria-imagenes-secundarias">
                                {producto.imagenesSecundarias.map((img, index) => (
                                    <div key={index} className="imagen-secundaria">
                                        <img src={img} alt={`Imagen secundaria ${index + 1}`} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <button className="agregar-imagenes-btn">Agregar Imágenes</button>
                        )}
                    </div>

                </div>
                
            </div>
            <div className="btn-atras">
                <button onClick={handleIrAtras}> &lt; Atrás</button>
            </div>

            <footer className="distribuidor-footer"></footer>
        </div>
    );
};

export default VistaVendedorDetalleProducto;





