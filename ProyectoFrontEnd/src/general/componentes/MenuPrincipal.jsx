import React from 'react';
import { useNavigate } from 'react-router-dom';
import MenuOpcion from './MenuOpcion';
import Header from './Header';

const MenuPrincipal = ({ menuOptions }) => {
    const navigate = useNavigate();

    const handleClick = (link) => {
        navigate(link);
    };

    return (
        <div className="menu-principal">
            
            <div className="menu-contenido">
                <div className='menu-titulo'>
                    <h2>Menú de Opciones</h2>
                </div>
                <div className="menu-opciones">
                    {menuOptions.map((option, index) => (
                        <div
                            key={index}
                            className="menu-link"
                            onClick={() => handleClick(option.link)} // Maneja el clic para navegar
                        >
                            <MenuOpcion
                                key={index}
                                icon={option.icon}
                                text={option.text}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MenuPrincipal;
