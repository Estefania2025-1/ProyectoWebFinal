import React from "react";
import iconCalidad from "../../pictures/iconCalidad.png";
import iconGarantia from "../../pictures/iconGarantiaS.png";
import iconEnvio from "../../pictures/iconEnvioGratis.png";
import iconSoporte from "../../pictures/iconSoporte.png";

const FooterCliente = () => {
    return (
        <footer className="vista-footer">
            <div className="footer-item">
                <img src={iconCalidad} className="footer-icon" />
                <div>Alta Calidad</div>
            </div>
            <div className="footer-item">
                <img src={iconGarantia} className="footer-icon" />
                <div>Garantía de Calidad</div>
            </div>
            <div className="footer-item">
                <img src={iconEnvio} className="footer-icon" />
                <div>Envío Gratis</div>
            </div>
            <div className="footer-item">
                <img src={iconSoporte} className="footer-icon" />
                <div>24/7 Soporte</div>
            </div>
        </footer>
    );
};

export default FooterCliente;