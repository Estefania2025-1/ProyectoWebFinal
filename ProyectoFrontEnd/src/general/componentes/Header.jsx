import React, { useState } from 'react';
import './Components.css';
import Mensajes from './Mensajes';
import logo from '../../pictures/flama.png';
import icono from '../../pictures/iconoIngresar.png';
import { useNavigate } from 'react-router-dom';
import { useUsuario } from '../componentes/UsuarioContext';


const Header = () => {
  const { usuario, logout } = useUsuario();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  const handleToggleProfileMenu = () => {
    setShowProfileMenu((prev) => !prev);
  };

  const handleLogout = () => {
    // Cerrar sesion completamente: limpiar contexto y localStorage
    logout(); // Limpiar el contexto
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('rol');
    navigate('/');
  };

  const handleHomeClick = () => {
    if (usuario && usuario.rol === 'cliente') {
      navigate('/menuCliente');
    } else if (usuario && usuario.rol === 'vendedor') {
      navigate('/menuVendedor');
    } else if (usuario && usuario.rol === 'distribuidor') {
      navigate('/menuDistribuidor');
    } else {
      navigate('/');
    }
  };

  const handleIrPerfilUsuario = () => {
    if (usuario && usuario.rol === 'cliente') {
      navigate('/perfil');
    } else if (usuario && usuario.rol === 'vendedor') {
      navigate('/perfil');
    } else if (usuario && usuario.rol === 'distribuidor') {
      navigate('/perfilDistribuidor');
    } else {
      navigate('/');
    }
  };

  const handleIrContact = () => {
    navigate('/contactanos');
  }
  const handleIrSobreNosotros = () => {
    navigate('/sobreNosotros');
  }
  const handleViewProfile = () => {
    setShowProfileMenu(false);
    navigate('/perfil');
  };

  return (
    <div>
      <header className="header">
        <div className="header-contenedor-logo">
          <img src={logo} alt="Logo" className="header-logo" />
          <h1>DELIVERY GAS</h1>
        </div>

        <div className="header-contenedor-informativo">
          <nav>
            <a onClick={handleHomeClick}>Home</a>
            <a onClick={handleIrSobreNosotros}>Sobre Nosotros</a>
            <a onClick={handleIrContact}>Contáctenos</a>
          </nav>
          <div className='header-profile-container'>
            <img src={icono} alt="icono" className="header-profile-icon" onClick={handleToggleProfileMenu}/>
            
            {showProfileMenu && (
            <div className="profile-menu">
                <div onClick={handleIrPerfilUsuario}>Ver Perfil</div>
                <div onClick={handleLogout}>Cerrar Sesión</div>
              </div>
            )}
          
          </div>

        </div>
      </header>

    </div>

  );
};

export default Header;
