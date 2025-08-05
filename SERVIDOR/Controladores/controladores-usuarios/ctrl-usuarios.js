import { userService } from '../services-backend/services.js';
import { generateJWToken, generateEmailConfirmToken, verifyEmailToken } from '../../utils/jwt.js';
import { createHash, isValidPassword } from '../../utils/bcrypt.js';
import sendConfirmationEmail from '../../utils/nodemailer.js';
import config from '../config/config.js';

/**
 * Inicia sesión de un usuario.
 * - Verifica email y contraseña
 * - Revisa si el email está confirmado
 * - Genera JWT y lo guarda en una cookie
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validación de campos
    if (!email || !password) {
      return res.status(400).send({ status: "error", message: "Incomplete values" });
    }

    const user = await userService.findByUsername(email);

    if (!user) {
      const error = new Error("Usuario no registrado");
      error.status = 404;
      throw error;
    }

    if (!user.isConfirmed) {
      const error = new Error("Error al iniciar sesión, el usuario no confirmó su email");
      error.status = 403;
      throw error;
    }

    if (!isValidPassword(user, password)) {
      const error = new Error("El usuario o la contraseña son incorrectas");
      error.status = 401;
      throw error;
    }

    // Guardar última conexión
    await userService.update(user._id, { last_connection: new Date() });

    // Generar token de sesión
    const tokenUserData = {
      id: user._id,
      email: user.email,
      username: user.username,
      role: user.role,
      isConfirmed: user.isConfirmed
    };

    const access_token = generateJWToken(tokenUserData);

    // Enviar cookie con token
    res
      .cookie('CookieToken', access_token, {
        httpOnly: false,
        secure: config.environment === 'production',
        sameSite: 'None',
        maxAge: 24 * 60 * 60 * 1000, // 1 día
      })
      .send({ status: "success", message: "Logged in", username: user.username });

  } catch (error) {
    console.error("Error during login:", error);
    res.status(error.status || 500).send({ status: "error", message: error.message });
  }
};

/**
 * Cierra la sesión de un usuario.
 * - Limpia la cookie de token
 */
const logout = async (req, res) => {
  const { uid } = req.params;

  try {
    const user = await userService.getAll(uid);

    if (!user) {
      return res.status(404).json({ status: "error", error: "User not found" });
    }

    res.clearCookie("CookieToken");
    return res.status(200).json({ message: "Logout successful" });

  } catch (error) {
    console.error("Error logging out user:", error);
    return res.status(500).json({ status: "error", error: "Internal server error" });
  }
};

/**
 * Registra un nuevo usuario.
 * - Valida campos y formato de contraseña
 * - Envía email de confirmación
 * - Crea usuario en la DB con contraseña hasheada
 */
const register = async (req, res) => {
  const { username, email, age, password, confirmPassword } = req.body;

  if (!username || !email || !age || !password || !confirmPassword) {
    return res.status(400).send({ status: "error", error: "Incomplete values" });
  }

  if (password !== confirmPassword) {
    return res.status(400).send({ status: "error", error: "Passwords do not match" });
  }

  // Contraseña segura: al menos 8 caracteres, una mayúscula
  const passwordRegex = /^(?=.*[A-Z]).{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).send({
      status: "error",
      error: "Password must be at least 8 characters long and contain at least one uppercase letter."
    });
  }

  const exists = await userService.findByUsername(email);
  if (exists) {
    return res.status(409).send({ status: "error", error: "Usuario ya existe en la base de datos" });
  }

  const token = generateEmailConfirmToken(email);

  const user = {
    username,
    email,
    age,
    password: createHash(password),
    confirmationToken: token,
    isConfirmed: false
  };

  try {
    await userService.save(user);
    await sendConfirmationEmail(email, token);
    res.send({ status: "success", message: "Usuario creado con éxito, por favor confirme su email" });
  } catch (error) {
    console.error("Error durante el registro:", error);
    res.status(500).send({ status: "error", error: "Error al registrar el usuario" });
  }
};

/**
 * Confirma el email del usuario usando un token
 */
const confirmEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const email = verifyEmailToken(token);

    if (!email) {
      return res.status(400).json({ message: "El enlace de confirmación es inválido o ha expirado." });
    }

    await userService.confirmUser(email);
    res.status(200).json({ message: "¡Gracias por confirmar tu email!" });

  } catch (error) {
    console.error("Error confirmando el email:", error);
    res.status(500).json({ message: "Error confirmando el email" });
  }
};

/**
 * Restablece la contraseña del usuario.
 * - Valida token
 * - Hashea la nueva contraseña
 */
const resetPassword = async (req, res) => {
  try {
    const { token, email, newPassword } = req.body;

    const verifyToken = verifyResetToken(token); // ⚠️: Esta función debe estar importada, falta en tu código

    if (verifyToken) {
      const error = new Error("El token es invalido o ya expiro");
      error.status = 401;
      throw error;
    }

    const user = await userService.findByUsername(email);

    if (!user) {
      const error = new Error("User Not Found: Usuario no encontrado con username: " + email);
      error.status = 404;
      throw error;
    }

    const hashedPassword = createHash(newPassword);

    const updateResult = await userService.update({ email }, { password: hashedPassword });

    if (updateResult && updateResult.modifiedCount > 0) {
      return res.status(200).send({ status: "success", message: "Contraseña cambiada exitosamente" });
    } else {
      const error = new Error("No se pudo realizar el reset password");
      error.status = 500;
      throw error;
    }

  } catch (error) {
    console.error("Error al resetear contraseña:", error);
    res.status(error.status || 500).send({ status: "error", message: error.message });
  }
};

/**
 * Obtiene un usuario por email.
 */
const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).send({ status: "error", message: "Email no proporcionado" });
    }

    const user = await userService.findByUsername(email);

    if (!user) {
      return res.status(404).send({ status: "error", message: "Usuario no encontrado" });
    }

    res.status(200).send({ status: "success", data: user });
  } catch (error) {
    console.error("Error obteniendo usuario por email:", error);
    res.status(500).send({ status: "error", message: "Error al buscar el usuario" });
  }
};

export default {
  register,
  login,
  logout,
  resetPassword,
  confirmEmail,
  getUserByEmail
};
