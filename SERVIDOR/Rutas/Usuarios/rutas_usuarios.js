// Importa Router de Express para definir rutas modulares
import { Router } from 'express';

// Importa el controlador de autenticación, que contiene la lógica de cada endpoint
import AuthController from '../controllers/auth-controllers.js';

// Importa Passport para manejar autenticaciones externas como Google y Facebook
import passport from 'passport';

// Funciones personalizadas para proteger rutas con JWT y verificar roles/autorización
import { passportCall, authorization } from '../../utils/passport.js';

// Crea una nueva instancia del router de Express
const router = Router();

/* 
|--------------------------------------------------
| 🔐 RUTAS DE AUTENTICACIÓN BÁSICAS
|--------------------------------------------------
*/

// Registro de usuario
router.post('/register', AuthController.register);

// Inicio de sesión
router.post('/login', AuthController.login);

// Cierre de sesión
router.post('/logout', AuthController.logout);

// Resetear contraseña (requiere autenticación JWT y rol autorizado)
router.put(
  "/resetPassword", 
  passportCall('jwt'),                            // Verifica el token JWT desde cookies
  authorization(['user', 'admin']),               // Solo permite usuarios o administradores
  AuthController.resetPassword                    // Controlador que gestiona el cambio
);

// Confirmación de email mediante token enviado por correo
router.get('/confirm/:token', AuthController.confirmEmail);

/* 
|--------------------------------------------------
| 🌐 AUTENTICACIÓN SOCIAL (OAuth 2.0)
|--------------------------------------------------
*/

// Redirige al usuario a Google para autenticación
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback de Google luego de autenticarse exitosamente
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', failureFlash: true }),
  (req, res) => {
    res.redirect('/dashboard'); // Redirige al dashboard si tuvo éxito
  }
);

// Redirige al usuario a Facebook para autenticación
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

// Callback de Facebook luego de autenticarse
router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login', failureFlash: true }),
  (req, res) => {
    res.redirect('/dashboard'); // Redirige si la autenticación fue exitosa
  }
);

/* 
|--------------------------------------------------
| 🔍 CONSULTA DE USUARIO POR EMAIL
|--------------------------------------------------
*/

// Busca un usuario en la base de datos por su correo electrónico
router.get('/user/:email', AuthController.getUserByEmail);

/* 
|--------------------------------------------------
| EXPORTACIÓN
|--------------------------------------------------
*/

// Exporta el router para ser usado en el servidor principal
export default router;
