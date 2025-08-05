/* IMPORTACIONES IMPORTANTES DEL PROYECTO */

// Express: framework principal para crear el servidor y manejar rutas.
import express from 'express';

// CORS: permite el acceso desde otros dominios (como frontend en localhost:5173).
import cors from 'cors';

// Body-parser: permite interpretar cuerpos de las peticiones (JSON, URL encoded, etc.)
import bodyParser from 'body-parser';

// Cookie parser: se puede usar si manejás autenticación basada en cookies.
// import cookieParser from 'cookie-parser'; // Descomentar si usás cookies

// __dirname simulado para ES Modules (fundamental para trabajar con rutas absolutas)
import __dirname from '../utils.js';

// Configuración general (variables de entorno, puertos, claves, etc.)
import config from './config/config.js';

// Inicialización de estrategias de Passport para autenticación
import initializePassport from './config/passport-config.js';

// Clase que maneja la conexión a MongoDB usando patrón Singleton
import MongoConnection from './MongoSingletonConect.js';

/* 
    ------------------ RUTAS ------------------
    A continuación podés importar tus rutas principales.
    Cada una debería manejar un aspecto distinto del sistema.
*/

// import authRoutes from './routes/auth-routes.js';
// import productsRoutes from './routes/products-routes.js';
// import cartsRoutes from './routes/cart-routes.js';
// import paymentsRoutes from './routes/payments-routes.js';

/* INICIALIZACIÓN DEL SERVIDOR EXPRESS */

const app = express();

// Puerto del servidor (desde .env o por defecto 5000)
const PORT = config.PORT || 5000;

/* CONFIGURACIÓN DE CORS */

// Define las opciones para permitir peticiones del frontend (por ejemplo, en Vite)
const corsOptions = {
  origin: 'http://localhost:5173',           // Frontend autorizado
  methods: 'GET,POST,PUT,DELETE',            // Métodos HTTP permitidos
  allowedHeaders: 'Content-Type, Authorization',
  credentials: true,                         // Permitir envío de cookies
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions)); // Aplica CORS con configuración

/*  MIDDLEWARES GLOBALES */

// Analiza cuerpos en formato JSON
app.use(express.json());

// Analiza datos codificados por formularios
app.use(express.urlencoded({ extended: true }));

// app.use(cookieParser()); // Descomentar si usás cookies con Passport

app.use(bodyParser.json()); // Middleware adicional para análisis de JSON

// Sirve archivos estáticos (como imágenes, HTML, etc.) desde la carpeta /src/public
app.use(express.static(__dirname + '/src/public'));

/*  INICIALIZACIÓN DE AUTENTICACIÓN CON PASSPORT */

initializePassport(); // Configura JWT, Facebook, etc.

/*  REGISTRO DE RUTAS */

// app.use('/api/auth', authRoutes);
// app.use('/api/products', productsRoutes);
// app.use('/api/carts', cartsRoutes);
// app.use('/api/payments', paymentsRoutes);

/* 🚀 INICIO DEL SERVIDOR */

app.listen(PORT, async () => {
  console.log("Servidor escuchando por el puerto: " + PORT);
  try {
    // Intenta conectar a MongoDB (solo una vez gracias al Singleton)
    await MongoConnection.getInstance();
    console.log("Conexión exitosa a MongoDB.");
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error);
    process.exit(); // Cierra el servidor si falla la conexión
  }
});