/**
 * Modelo de Ticket
 * Representa una orden de compra con todos los datos necesarios para la transacción.
 * 
 * @property {String} code - Código único del ticket (autogenerado).
 * @property {Date} date_created - Fecha de creación. Default: Date.now.
 * @property {Object} payer - Datos del pagador:
 *   @property {String} full_name - Nombre completo.
 *   @property {String} email - Correo del cliente.
 *   @property {Object} phone - Teléfono del cliente.
 *     @property {String} number - Número telefónico.
 *   @property {String} dni - Documento de identidad.
 *   @property {Object} address - Dirección de entrega:
 *     @property {String} direccion - Calle y número.
 *     @property {String} piso - Piso (opcional).
 *     @property {String} depto - Departamento (opcional).
 *     @property {String} codigoPostal - Código postal.
 *     @property {String} localidad - Ciudad.
 *     @property {String} provincia - Provincia.
 *     @property {String} zona - Zona o referencia adicional (opcional).
 * @property {String} shipping_method - Método de envío.
 * @property {String} payment_method - Método de pago.
 * @property {Number} transaction_amount - Monto total de la transacción.
 * @property {Array} Cart - Detalle de productos comprados:
 *   @property {ObjectId} _id - ID del ítem en el carrito.
 *   @property {ObjectId} id - Referencia al documento del carrito.
 *   @property {String} title - Título del producto.
 *   @property {Number} price - Precio unitario.
 *   @property {Number} quantity - Cantidad adquirida.
 * @property {String} status - Estado del ticket ('pending', 'listo'). Default: 'pending'.
 */
import { Schema, model } from "mongoose";
import cartModel from "./Cart-models.js";

const ticketSchema = new Schema({
  code: { 
    type: String, 
    unique: true, 
    required: true, 
    default: () => Math.random().toString(36).substring(7) 
  },
  date_created: { type: Date, default: Date.now },
  payer: {
    full_name: { type: String, required: true },
    email: { type: String, required: true },
    phone: {
      number: { type: String, required: true }
    },
    dni: { type: String, required: true },
    address: {
      direccion: { type: String, required: true },
      piso: { type: String },
      depto: { type: String },
      codigoPostal: { type: String, required: true },
      localidad: { type: String, required: true },
      provincia: { type: String, required: true },
      zona: { type: String }
    }
  },
  shipping_method: { type: String, required: true },
  payment_method: { type: String, required: true },
  transaction_amount: { type: Number, required: true },
  Cart: [{
    _id: { type: Schema.Types.ObjectId, auto: false },
    id: {type: Schema.Types.ObjectId, ref: cartModel ,required: true},
    title: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true}
  }],
  status: { 
    type: String, 
    required: true, 
    default: 'pending'  
  }
});

const Ticket = model('Ticket', ticketSchema);

export default Ticket;
