// Importa Router de Express para crear rutas modulares
import { Router } from 'express';

// Importa el middleware de Multer para manejo de archivos (subida de imágenes)
import { uploader } from '../../utils/multer.js';

// Importa el controlador que contiene la lógica de las rutas relacionadas con productos
import productsControllers from '../controllers/products-controllers.js';

// Importa funciones para proteger rutas: validación JWT y autorización por rol
import { passportCall, authorization } from '../../utils/passport.js';

// Crea una instancia del router
const router = Router();

/* 
|--------------------------------------------------
| 📦 RUTAS PÚBLICAS DE PRODUCTOS (GET)
|--------------------------------------------------
*/

// Obtener todos los productos o con filtros genéricos
router.get('/', productsControllers.getProducts);

// Obtener producto por ID
router.get('/:_id', productsControllers.getProducts);

// Obtener producto por código único
router.get('/code/:code', productsControllers.getProducts);

// Obtener productos por categoría
router.get('/category/:category', productsControllers.getProducts);

/* 
|--------------------------------------------------
| 🔐 RUTAS PROTEGIDAS PARA ADMIN (POST, PUT, DELETE)
|--------------------------------------------------
*/

// Crear un nuevo producto (requiere autenticación JWT y rol admin)
// Además, permite subir hasta 5 imágenes bajo el campo "thumbnail"
router.post(
  '/create',
  uploader.array('thumbnail', 5),              // Middleware de carga de imágenes
  passportCall('jwt'),                         // Verifica autenticación JWT
  authorization(['admin']),                    // Solo permite acceso a admins
  productsControllers.createProducts           // Controlador para crear producto
);

// Actualizar un producto por ID (solo admin)
router.put(
  '/update/:_id',
  passportCall('jwt'),
  authorization(['admin']),
  productsControllers.updateProducts
);

// Eliminar un producto por ID (solo admin)
router.delete(
  '/delete/:_id',
  passportCall('jwt'),
  authorization(['admin']),
  productsControllers.deleteProd
);

// Eliminar un producto por código (solo admin)
router.delete(
  '/delete/code/:code',
  passportCall('jwt'),
  authorization(['admin']),
  productsControllers.deleteProd
);

/* 
|--------------------------------------------------
| EXPORTACIÓN
|--------------------------------------------------
*/

// Exporta el router para que sea utilizado en el servidor principal
export default router;