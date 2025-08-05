// payments-controller.js

import { ticketService } from '../services-backend/services.js';

/**
 * Crea un nuevo ticket de compra
 */
const createTicket = async (req, res) => {
  try {
    const {
      payer,
      shipping_method,
      payment_method,
      transaction_amount,
      Cart
    } = req.body;

    // Validación de datos obligatorios
    if (
      !payer || !payer.full_name || !payer.email || !payer.dni ||
      !payer.phone || !payer.phone.number ||
      !payer.address || !payer.address.direccion || !payer.address.localidad ||
      !payer.address.provincia || !payer.address.codigoPostal ||
      !shipping_method || !payment_method || !transaction_amount ||
      !Cart || !Array.isArray(Cart) || Cart.length === 0
    ) {
      return res.status(400).json({
        status: "error",
        message: "Todos los campos del formulario de pago son obligatorios."
      });
    }

    // Crear ticket
    const newTicket = await ticketService.save(req.body);

    res.status(201).json({
      status: "success",
      message: "Ticket creado exitosamente.",
      data: newTicket
    });

  } catch (error) {
    console.error("Error al crear el ticket:", error);
    res.status(error.status || 500).json({
      status: "error",
      message: error.message || "Ocurrió un error inesperado al crear el ticket."
    });
  }
};

/**
 * Obtiene tickets según ID de usuario y estado (opcional)
 */
const getTickets = async (req, res) => {
  const { id } = req.params;
  const { status } = req.query;

  try {
    const tickets = await ticketService.getAll(id, status);
    res.status(200).json({
      status: "success",
      data: tickets
    });
  } catch (error) {
    console.error("Error al obtener tickets:", error);
    res.status(500).json({
      status: "error",
      message: "No se pudieron obtener los tickets."
    });
  }
};

/**
 * Actualiza el estado de un ticket por su ID
 */
const updateTicketStatus = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedTicket = await ticketService.updateStatus(id);

    if (!updatedTicket) {
      return res.status(404).json({
        status: "error",
        message: "Ticket no encontrado."
      });
    }

    res.status(200).json({
      status: "success",
      message: "Estado del ticket actualizado correctamente.",
      data: updatedTicket
    });

  } catch (error) {
    console.error("Error al actualizar el estado del ticket:", error);
    res.status(500).json({
      status: "error",
      message: "Error al actualizar el estado del ticket."
    });
  }
};

export {
  createTicket,
  getTickets,
  updateTicketStatus,
};
