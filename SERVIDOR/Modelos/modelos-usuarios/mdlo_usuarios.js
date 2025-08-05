/**
 * Modelo de Usuario
 * Define los datos personales y de autenticación de un usuario.
 * 
 * @property {String} username - Nombre de usuario (requerido).
 * @property {String} email - Correo electrónico único (requerido).
 * @property {Number} age - Edad del usuario (requerido).
 * @property {String} password - Contraseña (requerido).
 * @property {String} loggedBy - Método de registro ('form', 'google', 'facebook'). Default: 'form'.
 * @property {String} role - Rol del usuario ('user', 'admin'). Default: 'user'.
 * @property {Date|null} last_connection - Fecha de última conexión.
 * @property {String} confirmationToken - Token de confirmación de cuenta.
 * @property {Boolean} isConfirmed - Estado de verificación del correo. Default: false.
 * @property {String} googleId - ID único para login con Google.
 * @property {String} facebookId - ID único para login con Facebook.
 */
import { Schema, model } from "mongoose";

const userSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: {type: Number, required: true},
    password: { type: String, required: true },
    loggedBy: {
      type: String,
      default: 'form',
      enum: ['form', 'google', 'facebook'],
    },
    role: {
      type: String,
      default: 'user',
      enum: ['user', 'admin'],
    },
    last_connection: {
      type: Date,
      default: null,
    },
    confirmationToken: { type: String },
    isConfirmed: { type: Boolean, default: false },
    googleId: { type: String, unique: true, sparse: true },
    facebookId: { type: String, unique: true, sparse: true },
  });
  

const collectionName = 'users'; 

const usersModel = model(collectionName, userSchema);

export default usersModel;