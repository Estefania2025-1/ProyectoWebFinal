import React, { useState } from "react";
import "./AgregarTarjeta.css";
import tarjetaPrimera from "../../pictures/tarjetaPrimera.png";
import tarjetaSegunda from "../../pictures/tarjetaSegunda.png";
import Swal from 'sweetalert2'; 
import { useUsuario } from "../../general/componentes/UsuarioContext"; 

const AgregarTarjeta = ({ onClose, onAgregarTarjeta }) => {

    const { usuario } = useUsuario();

    const [tipoTarjeta, setTipoTarjeta] = useState("");
    const [nombreTitular, setNombreTitular] = useState("");
    const [numeroTarjeta, setNumeroTarjeta] = useState("");
    const [fechaVencimiento, setFechaVencimiento] = useState("");
    const [codigoSeguridad, setCodigoSeguridad] = useState("");
    const [errorCodigo, setErrorCodigo] = useState("");

    const handleCardChange = (event) => {
        setTipoTarjeta(event.target.value);
        setErrorCodigo("");
    };

    const handleConfirmar = () => {
        if (!tipoTarjeta || !numeroTarjeta || !fechaVencimiento || !codigoSeguridad || !nombreTitular) {
            Swal.fire('Error', 'Por favor, completa toda la información de la tarjeta.', 'error');
            return;
        }

        if (!/^\d{16}$/.test(numeroTarjeta)) {
            Swal.fire('Error', 'El número de tarjeta debe contener exactamente 16 dígitos.', 'error');
            return;
        }

        if (!validarCodigoSeguridad()) {
            Swal.fire('Error', 'Por favor, verifica que el código de seguridad sea correcto.', 'error');
            return;
        }

        const nuevaTarjeta = {
            tipoTarjeta,
            numeroTarjeta,
            fechaVencimiento,
            codigoSeguridad,
            nombreTitular,
            UserId: usuario.id,
            MetodoPagoId: 1
        };
        onAgregarTarjeta(nuevaTarjeta);
    };

    const validarCodigoSeguridad = () => {
        if (tipoTarjeta === "American Express") {
            if (!/^\d{4}$/.test(codigoSeguridad)) {
                setErrorCodigo("El código de seguridad de American Express debe tener 4 dígitos.");
                return false;
            }
        } else if (/^(Visa|Mastercard|Discover)$/.test(tipoTarjeta)) {
            if (!/^\d{3}$/.test(codigoSeguridad)) {
                setErrorCodigo("El código de seguridad debe tener 3 dígitos.");
                return false;
            }
        }
        setErrorCodigo("");
        return true;
    };


    return (
        <div className="agregar-tarjeta-principal">
            <div className="agregar-tarjeta-modal-content">
                <h3>Información de Tarjeta de Crédito</h3>
                <form className="agregar-tarjeta-form">
                    <fieldset className="agregar-tarjeta-tipo">
                        <legend>Selecciona tu Tarjeta de Crédito</legend>
                        <div className="agregar-tarjeta-opciones">
                            <label>
                                <input type="radio" name="tarjeta" value="Visa"
                                    checked={tipoTarjeta === "Visa"}
                                    onChange={handleCardChange}
                                />
                                Visa
                            </label>
                            <label>
                                <input type="radio" name="tarjeta" value="Mastercard"
                                    checked={tipoTarjeta === "Mastercard"}
                                    onChange={handleCardChange}
                                />
                                Mastercard
                            </label>
                            <label>
                                <input type="radio" name="tarjeta" value="Discover"
                                    checked={tipoTarjeta === "Discover"}
                                    onChange={handleCardChange}
                                />
                                Discover
                            </label>
                            <label>
                                <input type="radio" name="tarjeta" value="American Express"
                                    checked={tipoTarjeta === "American Express"}
                                    onChange={handleCardChange}
                                />
                                American Express
                            </label>
                        </div>
                    </fieldset>
                    <label className="agregar-tarjeta-numero">
                        Nombre Titular:
                        <input type="text" placeholder="Nombre del Titular" value={nombreTitular}
                            onChange={(e) => setNombreTitular(e.target.value)} maxLength={16} />
                    </label>
                    <label className="agregar-tarjeta-numero">
                        Número de Tarjeta:
                        <input type="text" placeholder="XXXX-XXXX-XXXX-XXXX" value={numeroTarjeta}
                            onChange={(e) => setNumeroTarjeta(e.target.value)} maxLength={16} />
                    </label>
                    <label className="agregar-tarjeta-items">
                        Fecha de Vencimiento:
                        <input type="date" value={fechaVencimiento} onChange={(e) => setFechaVencimiento(e.target.value)} />
                    </label>

                    <label className="agregar-tarjeta-items">
                        Código de Seguridad (CVV):
                        <input type="text" placeholder="123" value={codigoSeguridad}
                            onChange={(e) => setCodigoSeguridad(e.target.value)} />
                        
                        
                        {errorCodigo && <p className="error-codigo">{errorCodigo}</p>}
                        
                        <span className="tooltip-container">
                            ?
                            <div className="tooltip">
                                <div className="tooltip-primera">
                                    <p>
                                        <strong>Visa, Mastercard y Discover:</strong>
                                    </p>
                                    <p>Los tres dígitos ubicados en la parte posterior de la tarjeta, junto al panel de la firma.
                                    </p>
                                    <img src={tarjetaPrimera} alt="CVV trasera" />
                                </div>
                                <div className="tooltip-segunda">
                                    <p>
                                        <strong>American Express:</strong>
                                    </p>
                                    <p>Los cuatro dígitos ubicados en la parte delantera de la tarjeta, arriba del número de tarjeta de crédito.</p>
                                    <img src={tarjetaSegunda} alt="CVV delantera" />
                                </div>


                            </div>
                        </span>

                    </label>

                </form>
                <div className="agregar-tarjeta-botones">

                    <button className="agregar-tarjeta-btn-confirmar" type="button" onClick={handleConfirmar}>
                        Confirmar
                    </button>

                    <button className="agregar-tarjeta-cerrar-modal" onClick={onClose}>
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AgregarTarjeta;