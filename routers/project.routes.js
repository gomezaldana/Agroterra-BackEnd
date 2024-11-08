import express from 'express';
import authValidate from '../middlewares/auth.validate.js';
import controller from '../controllers/project.controller.js'
import multer from 'multer';

const router = express.Router();

// Configuración de Multer
const storage = multer.memoryStorage();  // Guardamos las imágenes en memoria
const upload = multer({ storage: storage });  // Configuración de multer

// Ruta para crear un proyecto
router.post('/',authValidate, upload.array('images', 5), controller.crearProyecto);

// Ruta para obtener un proyecto por ID
router.get('/:id',authValidate, controller.verProyecto);

// Ruta para eliminar un proyecto por ID
router.delete('/:id',authValidate, controller.borrarProyecto);

// Ruta para obtener todos los proyectos 
router.get('/', authValidate, controller.verProyectos);

// Ruta para obtener todos los proyectos de un usuario
router.get('/user/:id', authValidate, controller.verProyectosDeUsuario);

export default router;
