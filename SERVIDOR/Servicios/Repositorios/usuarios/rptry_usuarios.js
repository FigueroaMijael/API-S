/**
 * Repository de usuarios.
 * Interactúa con el DAO para mantener una capa de abstracción.
 */
export default class UsersRepository {
  constructor(dao) {
    this.dao = dao;
  }

  /**
   * Obtiene todos los usuarios o uno por ID.
   * @param {_id} _id - ID del usuario (opcional).
   * @returns {Array|Object} - Usuarios.
   */
  getAll = (_id) => {
    return this.dao.getAll(_id);
  };

  /**
   * Guarda un nuevo usuario.
   * @param {Object} user - Datos del usuario.
   * @returns {Object} - Usuario creado.
   */
  save = (user) => {
    return this.dao.save(user);
  };

  /**
   * Actualiza un usuario.
   * @param {string} _id - ID del usuario.
   * @param {Object} updateData - Datos a actualizar.
   * @returns {Object} - Usuario actualizado.
   */
  update = (_id, updateData) => {
    return this.dao.update(_id, updateData);
  };

  /**
   * Busca un usuario por email.
   * @param {string} email - Email del usuario.
   * @returns {Object|null} - Usuario encontrado o null.
   */
  findByUsername = async (email) => {
    return this.dao.findByUsername(email);
  };

  /**
   * Elimina un usuario.
   * @param {string} _id - ID del usuario a eliminar.
   * @returns {Object} - Usuario eliminado.
   */
  delete = async (_id) => {
    return this.dao.delete(_id);
  };

  /**
   * Busca usuarios inactivos desde una fecha.
   * @param {Date} inactiveSince - Fecha para inactividad.
   * @returns {Array} - Usuarios inactivos.
   */
  findInactiveUsers = async (inactiveSince) => {
    return this.dao.findInactiveUsers(inactiveSince);
  };

  /**
   * Confirma/verifica un usuario por email.
   * @param {string} email - Email del usuario.
   * @returns {Object} - Resultado de la actualización.
   */
  confirmUser = async (email) => {
    return this.dao.confirmUser(email);
  };
}
