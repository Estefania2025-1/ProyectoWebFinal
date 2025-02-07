import React, { createContext, useContext, useState, useEffect } from 'react';

const UsuarioContext = createContext();

export const UsuarioProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');
    const storedRol = localStorage.getItem('rol');

    if (storedToken && storedUserId && storedRol) {
      setUsuario({ token: storedToken, id: storedUserId, rol: storedRol });
    }
  }, []);

  const login = (token, userId, rol) => {
    setUsuario({ token, id: userId, rol });
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('rol', rol);
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('rol');
  };

  return (
    <UsuarioContext.Provider value={{ usuario, login, logout }}>
      {children}
    </UsuarioContext.Provider>
  );
};

// Hook para consumir el contexto
export const useUsuario = () => useContext(UsuarioContext);
