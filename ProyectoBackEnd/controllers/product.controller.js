const { response } = require('express');
const Product = require('../models/product.model');

module.exports.createProduct = async (req, response) => {
    try {
        const { nombre, tipo, subtipo, peso, cantidad, precioNuevo, precioRecarga, descripcion, informacionAdicional, imagenPrincipal, imagenesSecundarias, esRecargable } = req.body;

        // Verificar la disponibilidad según la cantidad
        let disponibilidad = 'disponible';
        if (cantidad === 0) {
            disponibilidad = 'agotado';
        } else if (cantidad < 5) {
            disponibilidad = 'poca disponibilidad';
        }

        const newProduct = await Product.create({
            nombre,
            tipo,
            subtipo,
            peso,
            cantidad,
            precioNuevo,
            precioRecarga,
            descripcion,
            informacionAdicional,
            imagenPrincipal,
            imagenesSecundarias,
            esRecargable,
            disponibilidad
        });

        response.json(newProduct);
    } catch (error) {
        console.log(error);
        response.status(400).json({ message: 'Error al crear el producto' });
    }
};

module.exports.getAllProducts = async (_, response) => {
    try {
        const products = await Product.findAll();
        response.json(products);
    } catch (error) {
        console.log(error);
        response.status(500).json(error);
    }
};

module.exports.getProductById = async (req, response) => {
    try {
        
        const product = await Product.findOne({ where: { id: req.params.id } });
        response.json(product);
        
    } catch (error) {
        console.log(error);
        response.status(500).json(error);
    }
};

module.exports.updateProduct = async (req, response) => {
    try {

        const { cantidad } = req.body;

        // Verificar y actualizar la disponibilidad según la cantidad
        if (cantidad !== undefined) {
            let disponibilidad = 'disponible';
            if (cantidad === 0) {
                disponibilidad = 'agotado';
            } else if (cantidad < 5) {
                disponibilidad = 'poca disponibilidad';
            }

            req.body.disponibilidad = disponibilidad; // Asignar la nueva disponibilidad
        }

        const [updateRowCount] = await Product.update(req.body, { where: { id: req.params.id } });
        
        if (updateRowCount) {
            const updateProduct = await Product.findOne({ where: { id: req.params.id } });
            response.json(updateProduct);
        } else {
            response.status(404).json({ message: 'Producto no encontrado' });
        }

    } catch (error) {
        console.log(error);
        response.status(500).json(error);
    }
};

module.exports.deleteProduct = async (req, response) => {
    try {
        const product = await Product.findOne({ where: { id: req.params.id } });

        if (!product) {
            return response.status(404).json({ message: 'Producto no encontrado' });
        }

        await Product.destroy({ where: { id: req.params.id } });
        response.json(product);

    } catch (error) {
        console.log(error);
        response.status(500).json(error);
    }
};