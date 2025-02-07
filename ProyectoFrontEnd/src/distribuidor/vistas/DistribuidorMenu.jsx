import React from 'react';
// import '../../componentes/Components.css';
import { useUsuario } from '../../general/componentes/UsuarioContext';
import { useNavigate } from 'react-router-dom';
import Header from '../../general/componentes/Header';
import MenuPrincipal from '../../general/componentes/MenuPrincipal';
import vendedoresIcon from '../../pictures/IconGestionVendedores.png';
import inventarioIcon from '../../pictures/IconInventario.png';
import reporteIcon from '../../pictures/IconGestionReporte.png';

const DistribuidorMenu = () => {

    const { usuario } = useUsuario();
    const navigate = useNavigate();

    if (!usuario) {
        console.log('No hay usuario autenticado');
        navigate('/');
    }

    console.log(`ID del usuario cliente: ${usuario ? usuario.id : ''}`);

    const menuOptions = [
        { icon: vendedoresIcon, text: "Gestión de Vendedores", link: `/gestionVendedores` },
        { icon: inventarioIcon, text: "Gestión Pedidos", link: `/gestionPedidos` },
        { icon: inventarioIcon, text: "Inventario", link: `/gestionProductos` },
        
    ];

    //         { icon: reporteIcon, text: "MAPA", link: `/mapaVendedores` },

    return (
        <div className="menu-app">
            <Header />
            <MenuPrincipal menuOptions={menuOptions} />
        </div>
    );
};

export default DistribuidorMenu;