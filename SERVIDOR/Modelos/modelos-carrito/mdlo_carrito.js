/**
 * Modelo de Carrito
 * Cada carrito contiene un listado de productos seleccionados por el usuario.
 * 
 * @property {ObjectId} _id - ID único generado automáticamente.
 * @property {Array} products - Lista de productos en el carrito.
 *   @property {ObjectId} _id - ID único del ítem del carrito.
 *   @property {ObjectId} product - Referencia al modelo de producto.
 *   @property {String} title - Título del producto.
 *   @property {Number} price - Precio unitario.
 *   @property {Array} thumbnails - Imágenes del producto.
 *     @property {String} url - URL de la imagen.
 *     @property {String} filename - Nombre del archivo de imagen.
 *   @property {Number} quantity - Cantidad agregada. Mínimo: 1.
 */
import { Schema, model } from 'mongoose';
import productModel from './Product-models.js';

const cartSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true },
  products: [{
    _id: { type: Schema.Types.ObjectId, auto: false },
    product: { type: Schema.Types.ObjectId, ref: productModel },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    thumbnails: [{
      url: { type: String, required: true },
      filename: { type: String, required: true }
    }],
    quantity: { type: Number, required: true, default: 1, min: [1, 'La cantidad mínima es 1'] }
  }]
});

const cartModel = model("Cart", cartSchema);

export default cartModel;