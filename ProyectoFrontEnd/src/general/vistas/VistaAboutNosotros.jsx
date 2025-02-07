import './VistaAboutNosotros.css';
import logo from '../../pictures/flama.png';
import Header from '../componentes/Header';

function VistaAboutNosotros({ usuarioActual }) {
    return (
        <div className='sobre-nosotros-app'>
            <Header/>

            <div className="sobre-nosotros-contenido-principal">
                <div className="sobre-nosotros-seccion">
                    <div className="sobre-nosotros-imagen-equipo">
                        <img src={require('../../pictures/equipo.png')} alt="Equipo" />
                    </div>
                    <div className="sobre-nosotros-texto">
                        <div className="sobre-nosotros-compania-name">
                            <img src={logo} alt="Logo1" className="sobre-nosotros-logo" />
                            <h2>COMPANY NAME</h2>
                        </div>
                        <div className="sobre-nosotros-descripcion">
                            <p>
                                En COMPANY NAME, creemos en la comodidad y transparencia para nuestros usuarios.
                                Con solo unos clics, puedes comparar precios, revisar la disponibilidad en tiempo real
                                y realizar pedidos de gas a domicilio desde cualquier lugar.
                            </p>
                            <p>
                                Nos esforzamos por brindar un servicio confiable y eficiente, apoyando tanto a los
                                consumidores como a los proveedores locales, ayudando a que todos tengan acceso
                                a energía en un solo lugar. Únete a COMPANY NAME y descubre una nueva manera de
                                comprar y vender gas en tu ciudad.
                            </p>
                        </div>
                        <div className="sobre-nosotros-acciones">
                            <button className="sobre-nosotros-boton-leer-mas">LEER MÁS</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default VistaAboutNosotros;