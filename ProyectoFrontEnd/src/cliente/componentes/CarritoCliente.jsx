import React from 'react';
import { Link } from 'react-router-dom';
import { useUsuario } from '../../general/componentes/UsuarioContext';
import { useNavigate } from 'react-router-dom';

const CarritoCliente = ({ carrito, setCarrito }) => {
    const { usuario } = useUsuario();
    const navigate = useNavigate();

    const calcularTotal = () => {
        return (carrito.reduce((total, producto) => total + ((producto.tipoCompra === 'nuevo' ? producto.precioNuevo : producto.precioRecarga) * producto.cantidad), 0))
    };

    const aumentarCantidad = (productoId, tipoCompra) => {
        setCarrito(carrito.map(producto =>
            producto.id === productoId && producto.tipoCompra === tipoCompra
                ? { ...producto, cantidad: producto.cantidad + 1 }
                : producto
        ));
    };

    const reducirCantidad = (productoId, tipoCompra) => {
        setCarrito(carrito.map(producto =>
            producto.id === productoId && producto.tipoCompra === tipoCompra && producto.cantidad > 1
                ? { ...producto, cantidad: producto.cantidad - 1 }
                : producto
        ));
    };

    const eliminarProducto = (productoId) => {
        setCarrito(carrito.filter(producto => producto.id !== productoId));
    };

    // Eliminar un tipo de compra específico (nuevo o recarga) para un producto
    const eliminarTipoCompra = (productoId, tipoCompra) => {
        setCarrito(carrito.filter(producto => producto.id !== productoId || producto.tipoCompra !== tipoCompra));
    };

    // Agrupar productos por id para evitar duplicados
    const productosAgrupados = carrito.reduce((acc, producto) => {
        const index = acc.findIndex(p => p.id === producto.id);
        if (index === -1) {
            acc.push({ id: producto.id, nombre: producto.nombre, imagenPrincipal: producto.imagenPrincipal, tipos: [producto] });
        } else {
            acc[index].tipos.push(producto);
        }
        return acc;
    }, []);

    console.log(`ID del usuario en el carrito: ${usuario.id}`);

    const handleIrCarrito = () => {
        navigate('/carrito');
    };

    return (
        <div className="carrito-contenedor">
            <h2>Carrito de Compras</h2>
            <div className="carrito-productos">
                {productosAgrupados.map((producto, index) => (
                    <div key={index} className="carrito-item">
                        <img src={producto.imagenPrincipal} alt={producto.nombre} className="carrito-imagen" />
                        <div className="carrito-detalles">
                            <p className="carrito-nombre">{producto.nombre}</p>

                            <div className="carrito-precios-cantidades">
                                {producto.tipos.map((tipo, idx) => (
                                    <div key={idx} className="carrito-tipo-compra">
                                        {tipo.tipoCompra === 'nuevo' && (
                                            <div>
                                                <p className='carrito-precio'>Nuevo: <strong> $ {tipo.precioNuevo} </strong> </p>
                                                <div className="carrito-cantidad-contenedor">
                                                    <button className="carrito-cantidad-boton" onClick={() => reducirCantidad(producto.id, 'nuevo')}> - </button>
                                                    <p className="carrito-cantidad">{tipo.cantidad}</p>

                                                    <button className="carrito-cantidad-boton" onClick={() => aumentarCantidad(producto.id, 'nuevo')}> + </button>

                                                </div>
                                                <button className="carrito-eliminar-boton-cantidad" onClick={() => eliminarTipoCompra(producto.id, 'nuevo')}>Eliminar</button>
                                            </div>
                                        )}
                                        {tipo.tipoCompra === 'recarga' && (
                                            <div>
                                                <p className='carrito-precio '>Recarga:<strong> $ {tipo.precioRecarga} </strong> </p>
                                                <div className="carrito-cantidad-contenedor">
                                                    <button className="carrito-cantidad-boton" onClick={() => reducirCantidad(producto.id, 'recarga')}> - </button>
                                                    <p className="carrito-cantidad">{tipo.cantidad}</p>


                                                    <button className="carrito-cantidad-boton" onClick={() => aumentarCantidad(producto.id, 'recarga')}> + </button>

                                                </div>
                                                <button className="carrito-eliminar-boton-cantidad" onClick={() => eliminarTipoCompra(producto.id, 'recarga')}>Eliminar</button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <button className="carrito-eliminar-boton" onClick={() => eliminarProducto(producto.id)}>Eliminar Producto</button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="carrito-total">
                <h3>Total: ${calcularTotal()}</h3>
            </div>
                <button className="btn-ir-carrito" onClick={handleIrCarrito}>
                    Ir a Carrito
                </button>
        </div>
    );
};

export default CarritoCliente;
