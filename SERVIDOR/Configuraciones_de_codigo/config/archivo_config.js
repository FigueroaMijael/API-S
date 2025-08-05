
// Importa la clase Command del paquete 'commander'.
// Commander permite manejar argumentos y opciones por línea de comandos fácilmente.
import { Command } from 'commander';

// Importa dotenv para poder cargar variables de entorno desde archivos .env.
import dotenv from 'dotenv';

// Importa el __dirname definido manualmente para obtener rutas absolutas.
import __dirname from '../../utils.js';

// Crea una nueva instancia del parser de comandos.
const program = new Command();

// Define opciones que pueden pasarse por línea de comandos al ejecutar la app.
// -d: Activa modo debug (por defecto es false).
// --test: Habilita modo testeo (por defecto es false).
// --persist: Define el tipo de persistencia (por defecto 'mongodb').
// --mode: Define el entorno de ejecución (por defecto 'development').
program
    .option('-d', 'Variable para debug', false)
    .option('--test', 'Variable para correr los test', false)
    .option('--persist <persist>', 'Modo de persistencia', "mongodb")
    .option('--mode <mode>', 'Modo de trabajo', 'development')

// Parsea los argumentos de línea de comandos.
program.parse(); 

// Obtiene el valor de persistencia desde las opciones pasadas.
const persistence = program.opts().persist;

// Obtiene el entorno (mode): 'development' o 'production'.
const environment = program.opts().mode;

// Verifica si se está ejecutando en modo test.
const test = program.opts().test;

// Carga el archivo .env correspondiente al entorno (dev o prod) según la opción --mode.
// Utiliza __dirname para construir una ruta absoluta.
dotenv.config({
    path: (__dirname, environment === "production" ? "./config/.env.prod" : "./config/.env.dev")
});

// Exporta un objeto con las variables de entorno y opciones de configuración
// Esto centraliza la configuración del servidor en un solo lugar y la hace reutilizable.
export default {
    PORT: process.env.PORT,
    URL: process.env.URL,
    MONGO_URL: process.env.MONGO_URL,

    jwtPrivateKey: process.env.JWTPRIVATEKEY,
    resetJwtPrivateKey: process.env.RESETJWTPRIVATEKEY,

    persistence: persistence,
    environment: environment,
    test: test,
};
