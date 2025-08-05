// Importamos los modelos de carrito y productos
import cartModel from "../../models/Cart-models.js";
import productModel from "../../models/Product-models.js";

export default class CartDao {

    // Obtener un carrito por ID (si no existe, lo crea automáticamente)
    getAll = async (_id) => {
        let cart;

        if (!_id) {
            // Buscar carrito por ID y hacer populate de los productos
            cart = await cartModel.findOne({ _id: _id }).populate('products.product');

            if (!cart) {
                // Si no existe, crear uno nuevo vacío
                const newCart = await cartModel.create({ products: [] });

                // Activar eliminación automática después de cierto tiempo
                this.autoDeleteAfterTimeout(newCart._id);

                return { _id: newCart._id, cartData: [newCart] };
            }

            return { _id: cart._id, cartData: [cart] };
        } else {
            cart = await cartModel.findById(_id);

            if (!cart) {
                const newCart = await cartModel.create({ products: [] });
                this.autoDeleteAfterTimeout(newCart._id);
                return { _id: newCart._id, cartData: [newCart] };
            }

            return cart;
        }
    }

    // Agregar un producto al carrito (o aumentar cantidad si ya existe)
    save = async (CId, PId, quantity) => {
        const cart = await this.getAll(CId);
        const product = await productModel.findById(PId);
        if (!cart || !product) throw new Error('Carrito o producto no encontrado');

        const itemIndex = cart.products.findIndex(p => p.product.toString() === PId);

        if (itemIndex > -1) {
            // Si el producto ya está, aumentar la cantidad
            cart.products[itemIndex].quantity += quantity;
        } else {
            // Si no, agregar el nuevo producto al carrito
            cart.products.push({ 
                product: PId, 
                title: product.title, 
                price: product.price, 
                thumbnails: product.thumbnails, 
                quantity 
            });
        }

        const updatedCart = await cart.save();
        return updatedCart;
    };

    // Aumentar cantidad de producto en carrito y disminuir el stock del producto
    increaseQuantityAndSubtractStock = async (CId, PId, quantity) => {
        const cart = await this.getAll(CId);
        const product = await productModel.findById(PId);

        if (!cart || !product) throw new Error('Carrito o producto no encontrado');

        const itemIndex = cart.products.findIndex(p => p.product.toString() === PId);

        if (itemIndex > -1 && product.stock >= quantity) {
            cart.products[itemIndex].quantity += quantity;
            product.stock -= quantity;

            await product.save();
            const updatedCart = await cart.save();
            return updatedCart;
        } else {
            throw new Error('Stock insuficiente o producto no encontrado en el carrito');
        }
    };

    // Disminuir cantidad en carrito y aumentar el stock del producto
    decreaseQuantityAndAddStock = async (CId, PId, quantity) => {
        const cart = await this.getAll(CId);
        const product = await productModel.findById(PId);

        if (!cart || !product) throw new Error('Carrito o producto no encontrado');

        const itemIndex = cart.products.findIndex(p => p.product.toString() === PId);

        if (itemIndex > -1 && cart.products[itemIndex].quantity >= quantity) {
            cart.products[itemIndex].quantity -= quantity;
            product.stock += quantity;

            // Eliminar producto si la cantidad es 0
            if (cart.products[itemIndex].quantity === 0) {
                cart.products.splice(itemIndex, 1);
            }

            await product.save();
            const updatedCart = await cart.save();
            return updatedCart;
        } else {
            throw new Error('Cantidad a decrementar mayor que la disponible en el carrito o negativa');
        }
    };

    // Vaciar completamente el carrito
    clearCart = async (CId) => {
        const cart = await this.getAll(CId);
        if (!cart) throw new Error('Carrito no encontrado');

        cart.products = [];
        const clearedCart = await cart.save();
        return clearedCart;
    };

    // Eliminar un producto específico del carrito
    deleteProductFromCart = async (CId, PId) => {
        const cart = await this.getAll(CId);
        if (!cart) throw new Error('Carrito no encontrado');

        const productIndex = cart.products.findIndex(p => p.product.toString() === PId);

        if (productIndex > -1) {
            cart.products.splice(productIndex, 1);
            const updatedCart = await cart.save();
            return updatedCart;
        } else {
            throw new Error('Producto no encontrado en el carrito');
        }
    };

    // Elimina automáticamente el carrito después de un tiempo (por defecto: 3 días)
    autoDeleteAfterTimeout = async (CId, timeout = 259200000) => {
        const cart = await cartModel.findById(CId);
        if (!cart) throw new Error('Carrito no encontrado');

        setTimeout(async () => {
            await cartModel.findByIdAndDelete(CId);
            console.log(`Carrito con id ${CId} eliminado automáticamente tras ${timeout} ms.`);
        }, timeout);
    };
}
