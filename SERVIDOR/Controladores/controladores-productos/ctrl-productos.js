import { productService } from "../services-backend/services.js";

/**
 * Obtiene productos según distintos criterios: ID, código, categoría, subcategoría, disponibilidad o búsqueda.
 */
const getProducts = async (req, res) => {
    try {
        const { _id, code, category } = req.params;
        const { subcategory, availability, query } = req.query;

        let datos;

        if (_id) {
            datos = await productService.getAll(_id);
        } else {
            datos = await productService.getAll(
                null,
                query,
                category,
                subcategory,
                availability,
                code
            );
        }

        res.json(datos);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
};

/**
 * Crea un nuevo producto con validación de datos, categorías y subcategorías predefinidas, y al menos dos imágenes.
 */
const createProducts = async (req, res) => {
    try {
        const { title, description, category, subcategory, code } = req.body;
        let { price, stock } = req.body;

        const capitalizeFirstLetter = (str) => {
            return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
        };

        const upperCaseCode = code.toUpperCase();

        if (/\d/.test(upperCaseCode) || /\s/.test(upperCaseCode)) {
            return res.status(400).json({ error: "El código no debe contener números ni espacios." });
        }

        const capitalizedTitle = capitalizeFirstLetter(title);
        const capitalizedDescription = capitalizeFirstLetter(description);
        const capitalizedCategory = capitalizeFirstLetter(category);
        const capitalizedSubcategory = capitalizeFirstLetter(subcategory);

        if (!capitalizedTitle || !capitalizedDescription || !code || !capitalizedCategory || !capitalizedSubcategory || !price || !stock) {
            return res.status(400).json({ error: "Todos los campos son obligatorios" });
        }

        price = parseInt(price);
        stock = parseInt(stock);

        if (typeof price !== 'number' || price <= 0) {
            return res.status(400).json({ error: "El precio debe ser un número positivo" });
        }

        if (typeof stock !== 'number' || stock < 0) {
            return res.status(400).json({ error: "El stock debe ser un número no negativo" });
        }

        const allowedCategories = {
            'Accesorios': ['Aritos', 'Argollas', 'Anillos', 'Broches', 'Carteras', 'Bolsos', 'Monederos'],
            'Botellas': ['Termos', 'Vasos', 'Mates'],
            'Infantiles': ['Juegos de mesa', 'Rompe cabezas', 'Muñecos', 'Autos', 'SuperHeroes'],
            'Hogar': ['Muebles', 'Bazar']
        };

        if (!allowedCategories[capitalizedCategory]) {
            return res.status(400).json({ error: "Categoría no válida" });
        }
        if (!allowedCategories[capitalizedCategory].includes(capitalizedSubcategory)) {
            return res.status(400).json({ error: "Subcategoría no válida para la categoría seleccionada" });
        }

        const thumbnails = req.files;
        if (!thumbnails || thumbnails.length < 2) {
            return res.status(400).json({ error: "Se requieren al menos dos imágenes" });
        }

        const images = thumbnails.map(file => ({
            url: file.path,
            filename: file.filename
        }));

        const productoACrear = {
            title: capitalizedTitle,
            description: capitalizedDescription,
            price,
            category: capitalizedCategory,
            subcategory: capitalizedSubcategory,
            thumbnails: images,
            clase: ['bg1', 'bg2', 'bg3'][Math.floor(Math.random() * 3)],
            code: upperCaseCode,
            stock,
        };

        const nuevoProducto = await productService.save(productoACrear);
        console.log("Producto creado exitosamente:", nuevoProducto);

        res.status(200).json({ data: nuevoProducto });

    } catch (error) {
        console.error("Error al crear el producto:", error);
        res.status(500).json({ error: "Error al crear el producto" });
    }
};

/**
 * Actualiza un producto existente con validaciones similares a la creación.
 */
const updateProducts = async (req, res, next) => {
    try {
        const { _id } = req.params;
        const newData = req.body;

        const existingProduct = await productService.getAll(_id);
        if (!existingProduct) {
            console.error("Producto no encontrado con _id: " + _id);
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        const { title, description, category, subcategory, code, price, stock } = newData;

        const upperCaseCode = code.toUpperCase();

        if (/\d/.test(upperCaseCode) || /\s/.test(upperCaseCode)) {
            return res.status(400).json({ error: "El código no debe contener números ni espacios." });
        }

        const capitalizeFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

        const capitalizedTitle = title ? capitalizeFirstLetter(title) : '';
        const capitalizedDescription = description ? capitalizeFirstLetter(description) : '';
        const capitalizedCategory = category ? capitalizeFirstLetter(category) : '';
        const capitalizedSubcategory = subcategory ? capitalizeFirstLetter(subcategory) : '';

        if (!capitalizedTitle || !capitalizedDescription || !code || !capitalizedCategory || !capitalizedSubcategory || !price || !stock) {
            return res.status(400).json({ error: "Todos los campos son obligatorios" });
        }

        if (typeof price !== 'number' || price <= 0) {
            return res.status(400).json({ error: "El precio debe ser un número positivo" });
        }

        if (typeof stock !== 'number' || stock < 0) {
            return res.status(400).json({ error: "El stock debe ser un número no negativo" });
        }

        const allowedCategories = {
            'Accesorios': ['Aritos', 'Argollas', 'Anillos', 'Broches', 'Carteras', 'Bolsos', 'Monederos'],
            'Botellas': ['Termos', 'Vasos', 'Mates'],
            'Infantiles': ['Juegos de mesa', 'Rompe cabezas', 'Muñecos', 'Autos', 'SuperHeroes'],
            'Hogar': ['Muebles', 'Bazar']
        };

        if (!allowedCategories[capitalizedCategory]) {
            return res.status(400).json({ error: "Categoría no válida" });
        }
        if (!allowedCategories[capitalizedCategory].includes(capitalizedSubcategory)) {
            return res.status(400).json({ error: "Subcategoría no válida para la categoría seleccionada" });
        }

        const updatedData = {
            title: capitalizedTitle,
            description: capitalizedDescription,
            price,
            category: capitalizedCategory,
            subcategory: capitalizedSubcategory,
            code: upperCaseCode,
            stock,
        };

        await productService.update(_id, updatedData);
        res.status(200).json({ message: "Dato actualizado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al actualizar el producto" });
    }
};

/**
 * Elimina un producto por ID o código.
 */
const deleteProd = async (req, res, next) => {
    try {
        const { _id, code } = req.params;

        let deletedProduct;

        if (_id) {
            deletedProduct = await productService.delete(_id, null);
        } else if (code) {
            deletedProduct = await productService.delete(null, code);
        } else {
            return res.status(400).json({ message: "Debe proporcionar un ID o un código" });
        }

        res.status(200).json({ message: `Producto con ${_id ? "ID" : "código"}: ${_id || code} eliminado con éxito`, deletedProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al eliminar el producto", error: error.message });
    }
};

export default {
    getProducts,
    createProducts,
    updateProducts,
    deleteProd,
};
