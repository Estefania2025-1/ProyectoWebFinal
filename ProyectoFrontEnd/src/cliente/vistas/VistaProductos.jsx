import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUsuario } from '../../general/componentes/UsuarioContext';
import './VistaProductos.css';
import ItemGas from '../componentes/ItemGas';
import Header from '../../general/componentes/Header';
import FiltrosProductos from '../componentes/FiltrosProductos';
import CarritoCliente from '../componentes/CarritoCliente';

import carritoIcon from '../../pictures/IconCarritos.png';
// Importacion de componentes para Google Maps

const VistaProuductos = () => {
    const { usuario } = useUsuario();
    const [productos, setProductos] = useState([]);
    const [filtros, setFiltros] = useState({
        tipo: [],
        subtipo: [],
        precio: []
    });

    const [busqueda, setBusqueda] = useState('');
    const [productosPorPagina, setProductosPorPagina] = useState(12);

    // Leer el carrito desde localStorage si está disponible
    const [carrito, setCarrito] = useState(() => {
        // const savedCarrito = localStorage.getItem('carrito');
        const savedCarrito = localStorage.getItem(`carrito_${usuario.id}`);
        return savedCarrito ? JSON.parse(savedCarrito) : [];
    });


    // CARGAR PRODUCTOS ****************

    useEffect(() => {
        axios.get('http://localhost:8000/productos')
            .then((response) => {
                setProductos(response.data);
            })
            .catch((error) => {
                console.error('Error al obtener los datos:', error)
            });
    }, []);

    // CARGAR CARRITO desde el localStorage*******************
    
    useEffect(() => {
        if (usuario && usuario.id) {
            localStorage.setItem(`carrito_${usuario.id}`, JSON.stringify(carrito));
        }
    }, [carrito, usuario]);
    
    
    const handleAgregarAlCarrito = (producto, tipoCompra) => {
        setCarrito((prevCarrito) => {
            // Comprobar si el producto con ese tipo de compra ya está en el carrito
            const productoExistente = prevCarrito.find(item => item.id === producto.id && item.tipoCompra === tipoCompra);
            if (productoExistente) {
                return prevCarrito.map(item =>
                    item.id === producto.id && item.tipoCompra === tipoCompra
                        ? { ...item, cantidad: item.cantidad + 1 }
                        : item
                );
            } else {
                return [...prevCarrito, { ...producto, cantidad: 1, tipoCompra }];
            }
        });
    };

    // FILTROS **********************

    const productosFiltrados = productos.filter((producto) => {
        const tipoMatch = filtros.tipo.length === 0 || filtros.tipo.includes(producto.tipo);
        const subtipoMatch = filtros.subtipo.length === 0 || filtros.subtipo.includes(producto.subtipo);
        const precioMatch = filtros.precio.length === 0 || filtros.precio.some(precio => {
            if (precio === 'menosDe3') return producto.precioNuevo < 3 || producto.precioRecarga < 3;
            if (precio === '3a5') return (producto.precioNuevo >= 3 && producto.precioNuevo <= 5) || (producto.precioRecarga >= 3 && producto.precioRecarga <= 5);
            if (precio === '5a7') return (producto.precioNuevo >= 5 && producto.precioNuevo <= 7) || (producto.precioRecarga >= 5 && producto.precioRecarga <= 7);
            if (precio === 'masDe7') return producto.precioNuevo > 7 || producto.precioRecarga > 7;
            return false;
        });

        const busquedaMatch = producto.nombre.toLowerCase().includes(busqueda.toLowerCase());

        return tipoMatch && subtipoMatch && precioMatch && busquedaMatch;
    });

    const handleFiltroTipo = (tipo, isChecked) => {
        setFiltros(prevFiltros => {
            const newTipos = isChecked
                ? [...prevFiltros.tipo, tipo]
                : prevFiltros.tipo.filter(t => t !== tipo);
            return { ...prevFiltros, tipo: newTipos };
        });
    };

    const handleFiltroSubtipo = (subtipo, isChecked) => {
        setFiltros(prevFiltros => {
            const newSubtipos = isChecked
                ? [...prevFiltros.subtipo, subtipo]
                : prevFiltros.subtipo.filter(s => s !== subtipo);
            return { ...prevFiltros, subtipo: newSubtipos };
        });
    };

    const handleFiltroPrecio = (precio, isChecked) => {
        setFiltros(prevFiltros => {
            const newPrecios = isChecked
                ? [...prevFiltros.precio, precio]
                : prevFiltros.precio.filter(p => p !== precio);
            return { ...prevFiltros, precio: newPrecios };
        });
    };

    // Busqueda y #Proudctos ********************
    const handleBusquedaChange = (event) => {
        setBusqueda(event.target.value);
    };

    const handleProductosPorPaginaChange = (event) => {
        setProductosPorPagina(parseInt(event.target.value));
    };

    const totalProductosCarrito = carrito.reduce((total, item) => total + item.cantidad, 0);


    return (
        <div className='cliente-productos-app'>
            <Header />
            <div className="contenedor-shop-principal">
                <h2>Shop</h2>
                <p>Home {'>'} Shop</p>
            </div>

            <div className="busqueda-product-header">
                <div className="busqueda-barra">
                    <span>Búsqueda: </span>
                    <input className="busqueda-especifico" type="text" placeholder="Búsqueda por nombre del producto" value={busqueda} onChange={handleBusquedaChange} />
                </div>
                <div className="busqueda-mostrar">
                    <span>Mostrar: </span>
                    <select value={productosPorPagina} onChange={handleProductosPorPaginaChange}>
                        <option value="12">12</option>
                        <option value="24">24</option>
                        <option value="36">36</option>
                    </select>
                    <span> | Mostrando 1-{Math.min(productosFiltrados.length, productosPorPagina)} de {productosFiltrados.length} resultados </span>

                    <div className="busqueda-carrito-contenedor">
                        <img src={carritoIcon} alt="Carrito" className="busqueda-carrito-icon" />
                        <span className="busqueda-carrito-numero">{totalProductosCarrito}</span>
                    </div>
                </div>
            </div>


            <div className="cliente-productos-contenido-principal">

                <FiltrosProductos onFiltroTipoChange={handleFiltroTipo} onFiltroSubtipoChange={handleFiltroSubtipo} onFiltroPrecioChange={handleFiltroPrecio} />

                <section className="cliente-productos-cuadro">
                    {productosFiltrados.map((producto) => (
                        <ItemGas key={producto.id} producto={producto} onAgregarAlCarrito={handleAgregarAlCarrito}/>
                    ))}
                </section>

                {carrito.length > 0 && (
                    <div className="carrito-seccion">
                        <CarritoCliente
                            carrito={carrito}
                            setCarrito={setCarrito}
                        />
                    </div>
                )}

            </div>

        </div>
    );
}

export default VistaProuductos;
