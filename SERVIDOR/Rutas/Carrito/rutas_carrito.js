// Importa Router de Express para definir rutas específicas del carrito
import { Router } from "express";

// Importa el controlador con toda la lógica relacionada al carrito
import cartControllers from "../controllers/cart-controllers.js";

// Crea una instancia del router
const router = Router();

/* 
|--------------------------------------------------
| 🛒 RUTAS PARA GESTIÓN DEL CARRITO DE COMPRAS
|--------------------------------------------------
*/

// Obtener todos los carritos o uno específico (dependiendo si se pasa ID)
router.get('/', cartControllers.getAllCart);
router.get('/:_id', cartControllers.getAllCart);

/*
📌 POST: Agregar un producto al carrito
- :CId → ID del carrito
- :PId → ID del producto
- :quantity → Cantidad a agregar
*/
router.post('/:CId/product/:PId/:quantity', cartControllers.postCart);

/*
📌 PUT: Aumentar cantidad de un producto en el carrito y restar stock disponible
*/
router.put(
  '/increase/:CId/product/:PId/:quantity',
  cartControllers.increaseQuantityAndSubtractStock
);

/*
📌 PUT: Disminuir cantidad de un producto en el carrito y devolver stock
*/
router.put(
  '/decrease/:CId/product/:PId/:quantity',
  cartControllers.decreaseQuantityAndAddStock
);

/*
📌 DELETE: Eliminar un producto específico del carrito
*/
router.delete(
  '/delete/:CId/product/:PId',
  cartControllers.deleteProductFromCart
);

/*
📌 DELETE: Vaciar todo el carrito (elimina todos los productos)
*/
router.delete(
  '/clear/:CId',
  cartControllers.clearCart
);

/*
|--------------------------------------------------
| EXPORTACIÓN
|--------------------------------------------------
*/

// Exporta el router para usarlo en el servidor principal
export default router;
