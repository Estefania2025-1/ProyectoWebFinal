import React, { useState, useEffect } from 'react';
import './ClienteComponentes.css';


const FiltrosProductos = ({ onFiltroTipoChange, onFiltroSubtipoChange, onFiltroPrecioChange }) => {
    const tipos = [
        { tipo: "GLP en Cilindros", subtipos: ["Doméstico", "Comercial"] },
        { tipo: "GLP a Granel", subtipos: ["Residencial", "Industrial", "AgroIndustrial"] }
    ];

    const precios = [
        { rango: "Menos de $3", valor: "menosDe3" },
        { rango: "$3 - $5", valor: "3a5" },
        { rango: "$5 - $7", valor: "5a7" },
        { rango: "Más de $7", valor: "masDe7" }
    ];

    const manejarCambioFiltroTipo = (tipo, isChecked) => {
        onFiltroTipoChange(tipo, isChecked);
    };

    const manejarCambioFiltroSubtipo = (subtipo, isChecked) => {
        onFiltroSubtipoChange(subtipo, isChecked);
    };

    const manejarCambioFiltroPrecio = (precio, isChecked) => {
        onFiltroPrecioChange(precio, isChecked);
    };

    return (
        <div className="filtros-contenedor">
            <h3>FILTROS</h3>
            <div className="filtros-grupo">
                <h4>TIPOS:</h4>
                {tipos.map((tipo, index) => (
                    <div key={index}>
                        <label>
                            <input type="checkbox" onChange={(e) => manejarCambioFiltroTipo(tipo.tipo, e.target.checked)}/>
                            {tipo.tipo}
                        </label>
                        <div>
                            {tipo.subtipos.map((subtipo, index) => (
                                <div key={index}>
                                    <input type="checkbox" onChange={(e) => manejarCambioFiltroSubtipo(subtipo, e.target.checked)}/>
                                    {subtipo}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="filtros-grupo">
                <h4>PRECIOS:</h4>
                {precios.map((precio, index) => (
                    <div key={index}>
                        <label>
                            <input type="checkbox" onChange={(e) => manejarCambioFiltroPrecio(precio.valor, e.target.checked)}/>
                            {precio.rango}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FiltrosProductos;
