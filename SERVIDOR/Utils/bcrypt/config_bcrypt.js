// Importa la librería bcrypt para hashing de contraseñas
import bcrypt from 'bcrypt';

/**
 * Encripta una contraseña usando bcrypt con un salt de 10 rondas.
 * @param {string} password - Contraseña en texto plano.
 * @returns {string} Contraseña encriptada.
 */
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

/**
 * Compara una contraseña ingresada con la almacenada en el usuario.
 * @param {Object} user - Objeto de usuario con el campo `password` encriptado.
 * @param {string} password - Contraseña en texto plano a verificar.
 * @returns {boolean} true si la contraseña coincide, false si no.
 */
export const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password);
}
