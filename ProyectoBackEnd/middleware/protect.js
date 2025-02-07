const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
module.exports.protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1]; 
            console.log('Token extraído: ', token);

            const decoded = jwt.verify(token, "hola"); 
            console.log('Decoded token: ', decoded);

            req.user = await User.findOne({ where: { id: decoded.id } }); 
            console.log('Usuario encontrado:', req.user);

            if (!req.user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            next();

        } catch (error) {
            res.status(401).json({ message: 'Not authorized!' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, missed token!' });
    }
    
};

module.exports.protectDistributor = (req, res, next) => {
    console.log('Usuario autenticado:', req.user);
    if (req.user && req.user.rol === 'distribuidor') {
        next();
    } else {
        return res.status(403).json({ message: 'No autorizado, solo distribuidores pueden registrar vendedores' });
    }
};
