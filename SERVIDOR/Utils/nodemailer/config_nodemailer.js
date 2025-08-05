import nodemailer from "nodemailer";
import config from "../backend/config/config.js";

/**
 * Configura el transporte de nodemailer usando Gmail.
 */
const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: config.emailUser,
        pass: config.emailPass,   
    }
});

/**
 * Verifica que el servidor SMTP esté listo.
 */
transporter.verify(function (error, success) {
    try {
        if (error) {
            console.error('No se pudo verificar el servidor de correo');  
        } else {
            console.info('Server is ready to take our messages' + success);
        }
    } catch (error) {
        console.log(error);
    }
});

/**
 * Envía un email de confirmación con link.
 * @param {string} email - Correo del destinatario.
 * @param {string} token - Token JWT de confirmación.
 */
async function sendConfirmationEmail(email, token) {
  const confirmationUrl = `http://localhost:5173/confirm-email?token=${token}`;

  const mailOptions = {
    from: config.emailUser,
    to: email,
    subject: 'Gracias por registrarte en Geminis. Confirma tu email',
    html: `...` // ✂️ Email HTML ya armado
  };  

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error('Could not send confirmation email');
  }
}

export default sendConfirmationEmail;
