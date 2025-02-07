import React from 'react';
// import '../../componentes/Components.css';
import { useNavigate } from 'react-router-dom';
import { useUsuario } from '../../general/componentes/UsuarioContext';

import Header from '../../general/componentes/Header';
import MenuPrincipal from '../../general/componentes/MenuPrincipal';
import pedidosIcon from '../../pictures/IconGestionPedidos.png';
import inventarioIcon from '../../pictures/IconInventario.png';
import transaccionesIcon from '../../pictures/IconVer.png';

const VendedorMenu = () => {
    const { usuario } = useUsuario();
    const navigate = useNavigate();
    if (!usuario) {
        console.log('No hay usuario autenticado');
        navigate('/');
    }

    console.log(`ID del usuario cliente: ${usuario ? usuario.id : ''}`);

    const menuOptions = [
        { icon: pedidosIcon, text: "Gestión de Pedidos", link: `/pedidosVendedor` },
        { icon: inventarioIcon, text: "Inventario", link: `/productoVendedor` },

    ];
    /**{ icon: transaccionesIcon, text: "Transacciones", link: `/pedidosVendedor` }, */
    return (
        <div className="menu-app">
            <div className="menu-app">
                <Header />
                <MenuPrincipal menuOptions={menuOptions} />
            </div>

        </div>
    );
};

export default VendedorMenu;
/**  <MenuPrincipal menuOptions={menuOptions} /> */