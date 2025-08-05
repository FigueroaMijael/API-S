import multer from "multer";
import fs from "fs";
import path from "path";
import __dirname from "../utils.js";

/**
 * Configura almacenamiento para archivos subidos con Multer.
 * Crea las carpetas necesarias dinámicamente si no existen.
 */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let uploadFolder;

        // Separa entre 'thumbnail' y otros tipos de imágenes
        if (file.fieldname === 'thumbnail') {
            uploadFolder = 'thumbnail';
        } else {
            uploadFolder = "img";
        }

        const fullPath = path.join(__dirname, `/src/public/assets/${uploadFolder}`);

        // Crea la carpeta si no existe
        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, { recursive: true });
        }

        cb(null, fullPath);
    },
    filename: function (req, file, cb) {
        // Nombre único para evitar sobrescritura
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    } 
});

/**
 * Exporta instancia de Multer configurada para permitir hasta 5 archivos.
 */
export const uploader = multer({
    storage,
    limits: { files: 5 },
    onError: function (err, next) {
        console.log(err);
        next();
    }
});
