import React, { useState, useEffect } from "react";
import "./VistaDistribuidorProducto.css";
import Header from "../../general/componentes/Header";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const VistaDistribuidorProducto = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [producto, setProducto] = useState({});
    const [error, setError] = useState(null);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [productoEditado, setProductoEditado] = useState({
        nombre: "",
        tipo: "",
        subtipo: "",
        fecha: "",
        peso: "",
        cantidad: "",
        precioNuevo: "",
        precioRecarga: "",
        descripcion: "",
        informacionAdicional: ""
    });

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

    useEffect(() => {
        if (producto.id) {
            setProductoEditado({
                nombre: producto.nombre || "",
                tipo: producto.tipo || "",
                subtipo: producto.subtipo || "",
                fecha: producto.fecha || "",
                peso: producto.peso || "",
                cantidad: producto.cantidad || "",
                precioNuevo: producto.precioNuevo || "",
                precioRecarga: producto.precioRecarga || "",
                descripcion: producto.descripcion || "",
                informacionAdicional: producto.informacionAdicional || ""
            });
        }
    }, [producto]);


    console.log('Producto obtenido:', producto);

    const manejarEdicion = (e) => {
        e.preventDefault();

        axios.put(`http://localhost:8000/productos/${id}`, productoEditado)
            .then(response => {
                setProducto(response.data);
                setMostrarFormulario(false);
                setError('');
                // alert('Producto editado con éxito');
                Swal.fire('Éxito', 'Producto editado exitosamente', 'success');
            })
            .catch(error => {
                console.error('Error al editar el producto:', error);
                // setError('Hubo un problema al editar el producto.');
                Swal.fire('Error', 'Hubo un problema al editar el producto.', 'error');
            });
    };

    const manejarCambio = (e) => {
        const { name, value } = e.target;
        setProductoEditado({
            ...productoEditado,
            [name]: value
        });
    };

    const handleIrAtras = () => {
        navigate('/gestionProductos');
    }

    return (
        <div className="distribuidor-producto-app">
            <Header />

            <div className="distribuidor-producto-principal">
                <div className="distribuidor-producto-header">
                    <h2>Detalles del Producto</h2>
                    <div className="distribuidor-producto-action-buttons">
                        <button onClick={() => setMostrarFormulario(true)}>Editar</button>
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

                {mostrarFormulario ? (
                    <div className="distribuidor-form-overlay">
                        <div className="distribuidor-form-container">
                            <button className="cerrar-modal" onClick={() => setMostrarFormulario(false)}>×</button>
                            <h3>Editar Producto</h3>
                            {error && <p className="error">{error}</p>}
                            <form onSubmit={manejarEdicion}>
                                <label>Nombre</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={productoEditado.nombre}
                                    onChange={manejarCambio}
                                    required
                                />
                                <label>Tipo</label>
                                <input
                                    type="text"
                                    name="tipo"
                                    value={productoEditado.tipo}
                                    onChange={manejarCambio}
                                    required
                                />
                                <label>Subtipo</label>
                                <input
                                    type="text"
                                    name="subtipo"
                                    value={productoEditado.subtipo}
                                    onChange={manejarCambio}
                                    required
                                />
                                <label>Peso (kg)</label>
                                <input
                                    type="number"
                                    name="peso"
                                    value={productoEditado.peso}
                                    onChange={manejarCambio}
                                    required
                                />
                                <label>Cantidad:</label>
                                <input
                                    type="number"
                                    name="cantidad"
                                    value={productoEditado.cantidad}
                                    onChange={manejarCambio}
                                    required
                                />
                                <label>Valor Nuevo</label>
                                <input
                                    type="number"
                                    name="precioNuevo"
                                    value={productoEditado.precioNuevo}
                                    onChange={manejarCambio}
                                    required
                                />
                                <label>Valor Recarga</label>
                                <input
                                    type="number"
                                    name="precioRecarga"
                                    value={productoEditado.precioRecarga}
                                    onChange={manejarCambio}
                                    required
                                />
                                <label>Descripción</label>
                                <textarea
                                    name="descripcion"
                                    value={productoEditado.descripcion}
                                    onChange={manejarCambio}
                                    required
                                />
                                <label>Información Adicional</label>
                                <textarea
                                    name="informacionAdicional"
                                    value={productoEditado.informacionAdicional}
                                    onChange={manejarCambio}
                                    required
                                />
                                <button type="submit">Guardar Cambios</button>
                                <button type="button" onClick={() => setMostrarFormulario(false)}>Cancelar</button>
                            </form>
                        </div>
                    </div>
                ) : null}

                
            </div>
            <div className="btn-atras">
                <button onClick={handleIrAtras}> &lt; Atrás</button>
            </div>

            <footer className="distribuidor-footer"></footer>
        </div>
    );
};

export default VistaDistribuidorProducto;





