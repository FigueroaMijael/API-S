# 📦 Gemini E-commerce API

Esta es una API RESTful construida con **Node.js** y **Express.js**, pensada para manejar operaciones típicas de un e-commerce como autenticación de usuarios, gestión de productos, carrito de compras y procesamiento de pagos.

## 🚀 Tecnologías Utilizadas

- **Node.js** & **Express.js**
- **MongoDB** con Mongoose
- **JWT** para autenticación
- **Bcrypt** para hasheo de contraseñas
- **Passport** para estrategias de autenticación
- **Multer** para manejo de archivos
- **Nodemailer** para envío de emails
- **dotenv** para variables de entorno

---

## 📁 Estructura del Proyecto

API's/
│
├── SERVIDOR/
│ ├── controllers/ # Lógica principal de cada endpoint
│ ├── dao/ # Acceso a base de datos (MongoDB)
│ ├── models/ # Modelos Mongoose (User, Product, Ticket, etc.)
│ ├── repository/ # Abstracción de los DAO
│ ├── routes/ # Rutas organizadas por recurso
│ ├── services-backend/ # Servicios auxiliares
│ ├── config/ # Configuraciones (Passport, env, email)
│ ├── middlewares/ # Middlewares personalizados
│ ├── utils/ # Utilidades como subida de archivos
│ └── server.js # Entrada principal del servidor


---

## 🔐 Autenticación y Seguridad

- Las contraseñas de usuarios se almacenan de forma segura usando **bcrypt**.
- Se utiliza **JWT** para proteger rutas privadas y mantener sesiones.
- Se integra **Passport** para autenticar usuarios y validar tokens.
- Los archivos `.env` permiten configurar los entornos de desarrollo y producción sin exponer datos sensibles.

---

## 📦 Funcionalidades Principales

### 👤 Usuarios

- Registro con email y contraseña (con confirmación por email).
- Login protegido con JWT.
- Middleware `updateLastConnection` para actualizar la última conexión.
- Envío de emails de confirmación usando Nodemailer.

### 🛍️ Productos

- Creación de productos con imágenes (hasta 5), usando **Multer**.
- Lectura, modificación y eliminación de productos.
- Asociación de productos con categorías, subcategorías y talles.

### 🛒 Carrito

- Añadir, eliminar y actualizar productos del carrito.
- Control de cantidades, precios y talles.

### 💳 Pagos y Tickets

- Creación de tickets con datos del comprador.
- Validación completa de datos (nombre, email, DNI, dirección, etc.).
- Actualización del estado del ticket (ej. de "pendiente" a "listo").

---

### ARCHIVO .ENV
PORT=3000
MONGO_URI=tu_string_de_conexión
JWT_SECRET=una_clave_segura
EMAIL_USER=tu_correo@gmail



## 📥 Instalación

```bash
git clone https://github.com/tu-usuario/Gemini-Ecommers.git
cd Gemini-Ecommers/backend
npm install

