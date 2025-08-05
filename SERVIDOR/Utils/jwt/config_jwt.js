// Carga configuración y librería de JWT
import config from '../backend/config/config.js';
import jwt from 'jsonwebtoken';

/**
 * Genera un JWT con los datos del usuario.
 * @param {Object} user - Objeto del usuario.
 * @returns {string} Token JWT válido por 24 horas.
 */
export const generateJWToken = (user) => {
    return jwt.sign({ user }, config.jwtPrivateKey, { expiresIn: '24h' });
};

/**
 * Genera un token especial para confirmar correo electrónico.
 * @param {string} email - Email del usuario.
 * @returns {string} Token JWT válido por 1 hora.
 */
export const generateEmailConfirmToken = (email) => {
    return jwt.sign({ email }, config.jwtPrivateKey, { expiresIn: '1h' });
};

/**
 * Verifica un token JWT de confirmación de email.
 * @param {string} token - Token JWT.
 * @returns {string|null} Email decodificado o null si el token no es válido.
 */
export const verifyEmailToken = (token) => {
    try {
        const decoded = jwt.verify(token, config.jwtPrivateKey);
        return decoded.email;  
    } catch (error) {
        console.error("Error verifying email token:", error);
        return null; 
    }
};

/**
 * Middleware para verificar JWT en la cabecera Authorization.
 */
export const authToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send({ error: "User not authenticated or missing token" });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, config.jwtPrivateKey, (error, decodedToken) => {
        if (error) {
            return res.status(403).send({ error: "Token invalid, unauthorized!" });
        }

        req.user = decodedToken.user; 
        next(); 
    });
};
