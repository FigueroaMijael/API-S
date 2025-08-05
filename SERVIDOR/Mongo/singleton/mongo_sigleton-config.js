// Importa mongoose, la biblioteca de ODM (Object Data Modeling) para MongoDB y Node.js.
import mongoose from 'mongoose';

// Importa la configuración del sistema, donde está definida la URL de conexión a MongoDB.
import config from './config/config.js';

// Define y exporta una clase que maneja la conexión a MongoDB.
export default class MongoConnection {
  
  // Propiedad privada estática que almacenará la única instancia de la clase.
  static #instance;

  // Constructor que se ejecuta al crear una nueva instancia.
  // Llama a la función que conecta con MongoDB.
  constructor() {
      this.#connectMongoDB();
  }

  // Método estático que implementa el patrón Singleton.
  // Si ya existe una instancia, la devuelve. Si no, crea una nueva.
  static getInstance() {
      if (!this.#instance) {
          this.#instance = new MongoConnection(); // Se conecta automáticamente al instanciar
      }
      return this.#instance;
  }

  // Método privado que realiza la conexión a MongoDB usando Mongoose.
  // Utiliza async/await para esperar la conexión antes de continuar.
  #connectMongoDB = async () => {
      try {
          await mongoose.connect(config.MONGO_URL); // Conexión usando la URL definida en config
          console.info("Conectado con éxito a MongoDB usando Mongoose.");
      } catch (error) {
         console.error(error); // Muestra errores en consola si la conexión falla
      }
  };
};
