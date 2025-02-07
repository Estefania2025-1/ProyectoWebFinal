import React, { useState } from 'react';
// import './Components.css';

const Mensajes = () => {
    const [messages] = useState([
        { id: 1, user: 'Usuario1', text: '¡Hola! Necesito ayuda con mi pedido.', image: 'https://i.pinimg.com/564x/fb/c1/5a/fbc15ab8f3a60a4f1578027a88b4498c.jpg' },
        { id: 2, user: 'Usuario2', text: '¿Cuándo se entregará el producto?', image: 'https://i.pinimg.com/564x/fb/c1/5a/fbc15ab8f3a60a4f1578027a88b4498c.jpg' },
        { id: 3, user: 'Usuario3', text: '¡Gracias por el excelente servicio!', image: 'https://i.pinimg.com/564x/fb/c1/5a/fbc15ab8f3a60a4f1578027a88b4498c.jpg' },
    ]);

    return (
        <div className="mensajes-container">
            <h2>Mensajes Recibidos</h2>
            {messages.map((message) => (
                <div key={message.id} className="mensaje">
                    <div className="mensaje-header">
                        <img
                            src={message.image}
                            alt={message.user}
                            className="mensaje-avatar"
                        />
                    </div>
                    <div>
                        <strong className="mensaje-user">{message.user}</strong>
                        <p>{message.text}</p>

                    </div>
                </div>
            ))}
        </div>
    );
};

export default Mensajes;
