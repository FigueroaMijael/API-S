// Importa el método 'fileURLToPath' del módulo 'url'.
// Este método permite convertir una URL de archivo (como 'import.meta.url') en una ruta de archivo válida.
import { fileURLToPath } from 'url';

// Importa el método 'dirname' del módulo 'path'.
// Este método se utiliza para obtener el directorio padre de una ruta de archivo.
import { dirname } from 'path';

// Convierte la URL del módulo actual (import.meta.url) en una ruta de archivo válida.
// Equivale a lo que sería '__filename' en CommonJS.
const __filename = fileURLToPath(import.meta.url);

// Obtiene el nombre del directorio del archivo actual, equivalente a '__dirname' en CommonJS.
const __dirname = dirname(__filename);

// Esto es fundamental en ES Modules porque __dirname no existe por defecto.
export default __dirname;
