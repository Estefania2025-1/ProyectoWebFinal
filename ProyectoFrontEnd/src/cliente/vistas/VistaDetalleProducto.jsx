// import logo from './logo.svg';
import './VistaDetalleProducto.css';
import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import Header from '../../general/componentes/Header';
import axios from 'axios';

const VistaDetalleProducto = () => {
    const { id } = useParams();
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
    /*
    if (!producto) {
        return <div>Cargando producto...</div>;
    }
    */

    return (
        <div className="cliente-detalle-app">
            <Header />
            
            <div className="contenedor-shop-principal">
                <h2>Shop</h2>
                <p>Home {'>'} Shop {'|'} {producto.nombre}</p>
            </div>

            <div className="cliente-detalle-contenido-principal">
                <div className="cliente-detalle-producto">
                    <div className="cliente-detalle-imagenes">
                        <div className="cliente-detalle-miniaturas">
                            {producto.imagenesSecundarias && producto.imagenesSecundarias.map((img, index) => (
                                <img key={index} src={img} alt={`Miniatura ${index + 1}`} />
                            ))}
                        </div>

                        <div className="cliente-detalle-imagen-producto">
                            {producto.imagenPrincipal && (
                                <img src={producto.imagenPrincipal} alt={producto.nombre} />
                            )}
                        </div>
                    </div>

                    <div className="cliente-detalle-info-producto">
                        <h3>{producto.nombre}</h3>
                        <p className="cliente-detalle-precio"><strong>Precio Nuevo:</strong>${producto.precioNuevo}</p>
                        <p className="cliente-detalle-precio"><strong>Precio Recarga:</strong>${producto.precioRecarga}</p>

                        <p className="cliente-detalle-descripcion">{producto.descripcion}</p>
                        
                    </div>
                </div>

                <div className="cliente-detalle-informacion-producto">
                    <h2>Información del Producto</h2>
                    <p>{producto.informacionAdicional}</p>
                </div>
            </div>
        </div>
    );
}

export default VistaDetalleProducto;
