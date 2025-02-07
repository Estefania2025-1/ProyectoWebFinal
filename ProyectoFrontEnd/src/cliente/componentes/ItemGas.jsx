import React from 'react';
import plusIcon from '../../pictures/IconAgregarProducto.png';
import { Link } from 'react-router-dom';

const ItemGas = ({ producto, onAgregarAlCarrito }) => {

  return (
    <div className="item-gas-principal">
      <img className="item-gas-imagen" src={producto.imagenPrincipal} alt={producto.nombre} />
      <div className="item-gas-detalles">
        <h3>{producto.nombre}</h3>
        <p>{producto.tipo} - {producto.subtipo}</p>
        <p><strong>Peso:</strong> {producto.peso} kg</p>
        <p>{producto.descripcion}</p>
        <div className="producto-precio-boton">
          <p>Nuevo: <strong className='item-gas-precio'> ${producto.precioNuevo} </strong> </p>
          <button className="precio-boton" onClick={() => onAgregarAlCarrito(producto, 'nuevo')}>
            <img src={plusIcon} alt="Agregar al carrito-NUEVO" className="plus-icon" />
          </button>

          <p>Recarga: <strong className='item-gas-precio'> ${producto.precioRecarga} </strong> </p>
          <button className="precio-boton" onClick={() => onAgregarAlCarrito(producto, 'recarga')}>
            <img src={plusIcon} alt="Agregar al carrito-RECERGA" className="plus-icon" />

          </button>
        </div>
        <Link to={`/productoDetalle/${producto.id}`} className="ver-mas-link">
          Ver más detalles
        </Link>
      </div>
    </div>
  );
};

export default ItemGas;
