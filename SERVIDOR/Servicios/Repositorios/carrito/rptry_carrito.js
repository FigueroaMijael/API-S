// Repository que actúa como intermediario entre los controladores y el DAO
// Permite desacoplar el controlador de la lógica de acceso a datos

export default class CartRepository {
    constructor(dao) {
        this.dao = dao;
    }

    // Obtener carrito por ID
    getAll = (_id) => {
        return this.dao.getAll(_id);
    }

    // Agregar producto al carrito
    save = (CId, PId, quantity) => {
        return this.dao.save(CId, PId, quantity);
    }

    // Aumentar cantidad en carrito y disminuir stock
    increaseQuantityAndSubtractStock = (CId, PId, quantity) => {
        return this.dao.increaseQuantityAndSubtractStock(CId, PId, quantity);
    }

    // Disminuir cantidad en carrito y aumentar stock
    decreaseQuantityAndAddStock = (CId, PId, quantity) => {
        return this.dao.decreaseQuantityAndAddStock(CId, PId, quantity);
    }

    // Vaciar carrito
    clearCart = (CId) => {
        return this.dao.clearCart(CId);
    }

    // Eliminar un producto específico del carrito
    deleteProductFromCart = (CId, PId) => {
        return this.dao.deleteProductFromCart(CId, PId);
    }
}
