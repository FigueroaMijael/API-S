import productModel from "../../models/Product-models.js";

/**
 * Data Access Object para productos.
 * Se encarga de interactuar directamente con la base de datos usando el modelo de productos.
 */
export default class ProductDao {

    /**
     * Obtiene productos desde la base de datos.
     * Puede devolver todos los productos, uno por ID o aplicar filtros por categoría, subcategoría, código, disponibilidad, etc.
     * 
     * @param {String} _id - ID del producto (opcional).
     * @param {String} query - Búsqueda por título (opcional).
     * @param {String} category - Filtro por categoría (opcional).
     * @param {String} subcategory - Filtro por subcategoría (opcional).
     * @param {String} availability - Si es "disponible", filtra productos con stock mayor a cero.
     * @param {String} code - Filtro por código del producto (opcional).
     * @returns {Object|Array} Producto(s) encontrado(s) o un solo producto si se pasa _id.
     */
    getAll = async (_id, query, category, subcategory, availability, code) => {
        const queryFilter = {
            ...(query ? { title: query } : {}),
            ...(category ? { category } : {}),
            ...(subcategory ? { subcategory } : {}),
            ...(code ? { code } : {}),
            stock: { $gt: 0 }, // stock mayor a 0 por defecto
        };

        if (availability === "disponible") {
            queryFilter.stock = { $gt: 0 };
        }

        const count = await productModel.countDocuments(queryFilter);

        if (!_id) {
            const products = await productModel.find(queryFilter);
            return {
                products,
                total: count,
            };
        } else {
            const product = await productModel.findById(_id);
            return product;
        }
    };

    /**
     * Crea un nuevo producto en la base de datos.
     * 
     * @param {Object} prod - Datos del nuevo producto.
     * @returns {Object} Producto creado.
     */
    save = async (prod) => {
        const newProduct = await productModel.create(prod);
        return newProduct;
    };

    /**
     * Actualiza un producto existente por ID.
     * 
     * @param {String} _id - ID del producto.
     * @param {Object} updateData - Datos para actualizar.
     * @returns {Object} Producto actualizado.
     */
    update = async (_id, updateData) => {
        const newProductUpdate = await productModel.findByIdAndUpdate(_id, updateData, { new: true });
        return newProductUpdate;
    };

    /**
     * Elimina un producto por ID o código.
     * 
     * @param {String} _id - ID del producto (opcional).
     * @param {String} code - Código del producto (opcional).
     * @returns {Object} Producto eliminado.
     * @throws {Error} Si no se encuentra el producto o no se pasa ni ID ni código.
     */
    delete = async (_id, code) => {
        try {
            if (_id) {
                const deletedProductById = await productModel.findById(_id);
                if (!deletedProductById) {
                    throw new Error("Producto no encontrado con el ID proporcionado");
                }
                return await productModel.findByIdAndDelete(_id);
            } else if (code) {
                const deletedProductByCode = await productModel.findOne({ code });
                if (!deletedProductByCode) {
                    throw new Error("Producto no encontrado con el código proporcionado");
                }
                return await productModel.findOneAndDelete({ code });
            } else {
                throw new Error("Debe proporcionar un ID o un código para eliminar el producto");
            }
        } catch (error) {
            throw error;
        }
    };
}
