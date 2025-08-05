/**
 * Repositorio de productos.
 * Encapsula la lógica de acceso a datos del DAO para desacoplarla del resto del sistema.
 */
export default class ProductRepository {
    constructor(dao) {
        this.dao = dao;
    }

    /**
     * Obtiene productos, aplicando los filtros si es necesario.
     * 
     * @param {String} _id 
     * @param {String} query 
     * @param {String} category 
     * @param {String} subcategory 
     * @param {String} availability 
     * @param {String} code 
     * @returns {Object|Array}
     */
    getAll = async (_id, query, category, subcategory, availability, code) => {
        return await this.dao.getAll(_id, query, category, subcategory, availability, code);
    }

    /**
     * Guarda un nuevo producto.
     * 
     * @param {Object} prod 
     * @returns {Object}
     */
    save = (prod) => {
        return this.dao.save(prod);
    }

    /**
     * Actualiza un producto existente.
     * 
     * @param {String} _id 
     * @param {Object} updateData 
     * @returns {Object}
     */
    update = (_id, updateData) => {
        return this.dao.update(_id, updateData);
    }

    /**
     * Elimina un producto por ID o código.
     * 
     * @param {String} _id 
     * @param {String} code 
     * @returns {Object}
     */
    delete = async (_id, code) => {
        return this.dao.delete(_id, code); 
    };
};
