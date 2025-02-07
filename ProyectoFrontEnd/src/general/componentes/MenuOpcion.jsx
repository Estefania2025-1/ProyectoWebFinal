import React from 'react';
import './Components.css';

const MenuOption = ({ icon, text }) => {
    return (
        <div className="menu-opcion">
            <div className="menu-opcion-imagen">
                <img src={icon} alt={text} />
            </div>
            <div className="menu-opcion-text">
                <p>{text}</p>
            </div>
        </div>
    );
};

export default MenuOption;
