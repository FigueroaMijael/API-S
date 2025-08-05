import Ticket from "../../models/Ticket-models.js";

export default class TicketDao {

  /**
   * Obtiene tickets filtrando por ID y estado (opcional)
   * @param {string} id - ID del ticket (opcional)
   * @param {string} status - Estado del ticket (opcional)
   * @returns {Promise<Array>} - Lista de tickets que coinciden con el filtro
   */
  getAll = async (id, status) => {
    try {
      const query = {};
      if (id) query._id = id;
      if (status) query.status = status;

      const tickets = await Ticket.find(query);
      return tickets;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Crea un nuevo ticket en la base de datos
   * @param {Object} ticketData - Datos del ticket a crear
   * @returns {Promise<Object>} - Ticket creado
   */
  save = async (ticketData) => {
    try {
      const ticket = await Ticket.create(ticketData);
      return ticket;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Actualiza el estado de un ticket a "listo"
   * @param {string} id - ID del ticket a actualizar
   * @returns {Promise<Object|null>} - Ticket actualizado o null si no existe
   */
  updateStatus = async (id) => {
    try {
      const updatedTicket = await Ticket.findByIdAndUpdate(
        id, 
        { status: "listo" }, 
        { new: true }  // Para devolver el documento actualizado
      );
      return updatedTicket;
    } catch (error) {
      throw error;
    }
  }
}
