// Importa Router de Express para definir rutas específicas relacionadas a pagos
import { Router } from 'express';

// Importa los controladores que manejan la lógica de los endpoints de pagos/tickets
import { createTicket, getTickets, updateTicketStatus } from '../controllers/payments-controllers.js';

// Crea una nueva instancia del router
const router = Router();

/* 
|--------------------------------------------------
| 🎟️ RUTAS PARA GESTIÓN DE TICKETS DE PAGO
|--------------------------------------------------
*/

// Crear un nuevo ticket de pago (por ejemplo, tras finalizar una compra)
router.post('/tickets', createTicket);

// Obtener todos los tickets o uno específico según query o lógica interna
router.get('/ticket', getTickets);

// Obtener un ticket específico por ID
router.get('/ticket/:id', getTickets);

// Actualizar el estado de un ticket (por ejemplo: pendiente → pagado)
router.put('/tickets/:id/status', updateTicketStatus);

/* 
|--------------------------------------------------
| EXPORTACIÓN
|--------------------------------------------------
*/

// Exporta el router para ser utilizado por el servidor principal
export default router;
