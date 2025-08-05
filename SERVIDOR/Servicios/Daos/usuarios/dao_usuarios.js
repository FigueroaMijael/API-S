// Importa el modelo de usuarios de Mongoose
import usersModel from "../../models/User-models.js";

/**
 * DAO (Data Access Object) para usuarios.
 * Encapsula todas las operaciones de acceso a datos sobre la colección "users".
 */
export default class UserDao {

    /**
     * Obtiene todos los usuarios o un usuario específico por ID.
     * @param {_id} _id - ID del usuario (opcional).
     * @returns {Array|Object} - Lista de usuarios o un único usuario.
     */
    getAll = async (_id) => {
        if (!_id) {
            const users = await usersModel.find();
            return users;   
        } else {
            const user = await usersModel.findById(_id);
            return user; 
        }
    };

    /**
     * Busca un usuario por email (se usa como username).
     * @param {string} email - Email del usuario.
     * @returns {Object|null} - Usuario encontrado o null.
     */
    findByUsername = async (email) => {
        const result = await usersModel.findOne({ email: email });
        return result;
    };

    /**
     * Guarda un nuevo usuario en la base de datos.
     * @param {Object} obj - Datos del nuevo usuario.
     * @returns {Object} - Usuario creado.
     */
    save = async (obj) => {
        const result = await usersModel.create(obj);
        return result;
    };

    /**
     * Actualiza los datos de un usuario por ID.
     * @param {string} _id - ID del usuario.
     * @param {Object} updateData - Datos a actualizar.
     * @returns {Object} - Usuario actualizado.
     */
    update = async (_id, updateData) => {
        const newProductUpdate = await usersModel.findByIdAndUpdate(_id, updateData);
        return newProductUpdate;
    };

    /**
     * Elimina un usuario por ID.
     * @param {string} _id - ID del usuario a eliminar.
     * @returns {Object} - Usuario eliminado.
     */
    delete = async (_id) => {
        const userDelete = await usersModel.findByIdAndDelete(_id);
        return userDelete;
    };

    /**
     * Busca usuarios inactivos desde una fecha determinada.
     * @param {Date} inactiveSince - Fecha límite para considerar inactividad.
     * @returns {Array} - Lista de usuarios inactivos.
     */
    findInactiveUsers = async (inactiveSince) => {
        const inactiveUsers = await usersModel.find({ last_connection: { $lt: inactiveSince } });
        return inactiveUsers;
    };

    /**
     * Confirma un usuario marcándolo como verificado.
     * @param {string} email - Email del usuario.
     * @returns {Object} - Resultado de la operación de actualización.
     */
    confirmUser = async (email) => {
        return await usersModel.updateOne({ email }, { isConfirmed: true });
    };
}
