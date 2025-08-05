// Importamos los DAOs (Data Access Objects) para cada entidad del sistema.
// Estos DAOs manejan la lógica específica para acceder a la base de datos (MongoDB en este caso).
import UserDao from './dao/User-dao.js';
import TicketDao from './dao/Ticket-dao.js';
import CartDao from './dao/Cart-dao.js';
import ProductDao from './dao/Product-dao.js';

// Importamos los Repositories que actúan como intermediarios entre los DAOs y los controladores.
// Encapsulan la lógica de negocio y llaman a los métodos de los DAOs.
import UsersRepository from './repository/users-repository.js';
import TicketRepository from './repository/ticket-repository.js';
import CartRepository from './repository/cart-repository.js';
import ProductRepository from './repository/products-repository.js';

// Creamos instancias de los DAOs, que contienen la lógica de acceso a los datos para cada modelo.
const usersDao = new UserDao();
const ticketsDao = new TicketDao();
const cartsDao = new CartDao();
const productsDao = new ProductDao();

// Creamos servicios a partir de los repositorios, inyectando los DAOs correspondientes.
// Estos servicios pueden ser usados por los controladores para ejecutar operaciones de negocio
// sin tener que preocuparse por los detalles de acceso a la base de datos.
export const userService = new UsersRepository(usersDao);
export const ticketService = new TicketRepository(ticketsDao);
export const cartService = new CartRepository(cartsDao);
export const productService = new ProductRepository(productsDao);
