/**
 * Modelo de Producto
 * Representa un producto disponible para la venta.
 * 
 * @property {String} title - Nombre del producto (requerido).
 * @property {String} description - Descripción detallada (requerido).
 * @property {Number} price - Precio del producto (requerido).
 * @property {String} category - Categoría principal (requerido).
 * @property {String} subcategory - Subcategoría del producto (requerido).
 * @property {Array} thumbnails - Galería de imágenes.
 *   @property {ObjectId} _id - ID de la imagen.
 *   @property {String} url - URL de la imagen (requerido).
 *   @property {String} filename - Nombre de archivo (requerido).
 * @property {String} clase - Clase o tipo de producto (requerido).
 * @property {String} code - Código único del producto (requerido).
 * @property {Number} stock - Unidades disponibles en inventario (requerido).
 */
import { Schema, model } from 'mongoose';

const productSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    subcategory: { type: String, required: true},
    thumbnails: [{
        _id: { type: Schema.Types.ObjectId, auto: false },
        url: { type: String, required: true },
        filename: { type: String, required: true }
    }],
    clase: { type: String, required: true},
    code: { type: String, required: true },
    stock: { type: Number, required: true },
});

const productModel = model("products", productSchema);

export default productModel;
