import React from 'react';
import './ClienteMenu.css';
import { useNavigate } from 'react-router-dom';
import { useUsuario } from '../../general/componentes/UsuarioContext';
import MenuPrincipal from '../../general/componentes/MenuPrincipal';
import productosIcon from '../../pictures/IconProductos.png';
import carritoIcon from '../../pictures/IconCarritos.png';
import transaccionesIcon from '../../pictures/IconTransacciones.png';
import Header from '../../general/componentes/Header';
const ClienteMenu = () => {
    const { usuario} = useUsuario();
    const navigate = useNavigate();
    if (!usuario) {
        console.log('No hay usuario autenticado');
        navigate('/');
    }

    console.log(`ID del usuario cliente: ${usuario ? usuario.id : ''}`);

    const menuOptions = [
        { icon: productosIcon, text: "Productos", link: `/productos` },
        { icon: carritoIcon, text: "Carrito", link: `/carrito`  },
        { icon: transaccionesIcon, text: "Pedidos", link: `/pedidos`  },
    ];         

    return (
        <div className="menu-app">
            <Header/>
            <MenuPrincipal menuOptions={menuOptions} />
        </div>
    ); 
};

export default ClienteMenu;
