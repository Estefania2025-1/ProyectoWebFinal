import React from 'react';
import './VistaContact.css';
import Header from '../componentes/Header';

function VistaContact() {
    
    return (
        <div className='contact-app'>
            <Header/>

            <div className="contact-principal">
                <div className="contact-container">
                    <div className="contact-left">
                        <h2>CONTACTO</h2>
                        <p>
                            Estamos aquí para ayudarte a dar el siguiente paso hacia tu compra
                            ideal. Si tienes preguntas o necesitas asesoría, no dudes en
                            contactarnos. Nuestro equipo está listo para ofrecerte atención
                            personalizada y resolver todas tus inquietudes. ¡Tu futuro comienza
                            con un simple mensaje!
                        </p>
                        <h3>Si tiene alguna pregunta póngase en contacto con nosotros:</h3>
                        <div className="contact-info">
                            <p>📞 911-234-5678</p>
                            <p>✉️ company.name@companyname.com</p>
                        </div>
                        <div  className="contact-form-notice">
                            <p>
                                Por favor, rellene el siguiente formulario para enviarnos un correo
                                electrónico.
                            </p>
                        </div>

                    </div>

                    <div className="contact-right">
                        <form >
                            <input
                                type="text"
                                name="name"
                                placeholder="NOMBRE"
                                // value={formData.name}
                                // onChange={handleChange}
                                required
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="E-MAIL"
                                // value={formData.email}
                                // onChange={handleChange}
                                required
                            />
                            <input
                                type="text"
                                name="subject"
                                placeholder="TEMA"
                                // value={formData.subject}
                                // onChange={handleChange}
                                required
                            />
                            <textarea
                                name="message"
                                placeholder="Escriba su mensaje aquí"
                                // value={formData.message}
                                // onChange={handleChange}
                                required
                            ></textarea>
                            <button type="submit">ENVIAR</button>
                        </form>
                    </div>
                </div>
            </div>

        </div>

    );
}

export default VistaContact;
