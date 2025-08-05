
// Importamos los servicios del carrito y del producto
import { cartService, productService } from '../services-backend/services.js';

/**
 * Obtiene todos los productos del carrito de un usuario dado su ID
 */
const getAllCart = async (req, res) => {
    try {
        const { _id } = req.params; // ID del carrito desde los parámetros de la URL
        const dataCart = await cartService.getAll(_id); // Llama al servicio que obtiene el carrito
        res.json(dataCart); // Devuelve el carrito en formato JSON
    } catch (error) {
        res.status(500).json({ message: error.message }); // Manejo de errores
    }
};

/**
 * Agrega un producto al carrito con una cantidad determinada
 */
const postCart = async (req, res) => {
    try {
        const { CId, PId, quantity = 1 } = req.params; // Extraemos el ID del carrito, producto y la cantidad desde los params
        const parsedQuantity = parseInt(quantity); // Aseguramos que la cantidad sea un número entero

        // Validamos que la cantidad sea válida
        if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
            return res.status(400).json({ message: "Cantidad no válida" });
        }

        // Verificamos que el carrito y el producto existan
        const cartExists = await cartService.getAll(CId);
        const prodExists = await productService.getAll(PId);

        if (!cartExists || !prodExists) {
            return res.status(404).json({ message: "Carrito o producto no encontrado" });
        }

        // Verificamos si hay suficiente stock
        if (parsedQuantity > prodExists.stock) {
            return res.status(400).json({ message: "Stock insuficiente" });
        }

        // Agregamos el producto al carrito
        const newCart = await cartService.save(CId, PId, parsedQuantity);
        res.status(200).json({ message: "Producto agregado con éxito al carrito", cart: newCart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Aumenta la cantidad de un producto en el carrito y descuenta del stock
 */
const increaseQuantityAndSubtractStock = async (req, res) => {
    try {
        const { CId, PId, quantity = 1 } = req.params;
        const parsedQuantity = parseInt(quantity);

        // Validamos la cantidad
        if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
            return res.status(400).json({ message: "Cantidad no válida" });
        }

        // Llamamos al servicio que se encarga de actualizar la cantidad y descontar el stock
        const newCart = await cartService.increaseQuantityAndSubtractStock(CId, PId, parsedQuantity);
        res.status(200).json({ message: "Cantidad aumentada y stock actualizado", cart: newCart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Disminuye la cantidad de un producto en el carrito y suma al stock
 */
const decreaseQuantityAndAddStock = async (req, res) => {
    try {
        const { CId, PId, quantity = 1 } = req.params;
        const parsedQuantity = parseInt(quantity);

        // Validamos la cantidad
        if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
            return res.status(400).json({ message: "Cantidad no válida" });
        }

        // Llamamos al servicio que disminuye la cantidad en el carrito y devuelve el stock
        const newCart = await cartService.decreaseQuantityAndAddStock(CId, PId, parsedQuantity);
        res.status(200).json({ message: "Cantidad disminuida y stock actualizado", cart: newCart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Elimina un producto del carrito
 */
const deleteProductFromCart = async (req, res) => {
    try {
        const { CId, PId } = req.params;
        const newCart = await cartService.deleteProductFromCart(CId, PId);
        res.status(200).json({ message: "Producto eliminado del carrito", cart: newCart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Vacía completamente un carrito
 */
const clearCart = async (req, res) => {
    try {
        const { CId } = req.params;
        const clearedCart = await cartService.clearCart(CId); // Llama al servicio para vaciar el carrito
        res.status(200).json({ message: "Carrito limpiado con éxito", cart: clearedCart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Exportamos todas las funciones del controlador como un objeto
export default {
    getAllCart,
    postCart,
    increaseQuantityAndSubtractStock,
    decreaseQuantityAndAddStock,
    deleteProductFromCart,
    clearCart,
};
