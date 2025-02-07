import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUsuario } from '../componentes/UsuarioContext';
import Swal from 'sweetalert2';

const ProtectedRoute = ({ requiredRole }) => {
    const { usuario } = useUsuario();

    useEffect(() => {
        // Si no hay usuario o el rol no coincide con el rol requerido se muestra una alerta
        if (!usuario || usuario.rol !== requiredRole) {
            Swal.fire({
                icon: 'warning',
                title: '¡Acceso Denegado!',
                text: 'Debe iniciar sesión para poder ver esta página.',
                confirmButtonText: 'Iniciar sesión',
                timer: 5000,  
            });
        }
    }, [usuario, requiredRole]);

    // Si no hay usuario o el rol no coincide se redirige a la página de login
    if (!usuario || usuario.rol !== requiredRole) {
        return <Navigate to="/" replace />;
    }

    // Si el usuario tiene el rol adecuado se renderiza a la ruta protegida
    return <Outlet />;
};

export default ProtectedRoute;
