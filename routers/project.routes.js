import express from 'express';
import authValidate from '../middlewares/auth.validate.js';
import controller from '../controllers/project.controller.js'

const router = express.Router();

// Ruta para crear un proyecto
router.post('/',authValidate, controller.crearProyecto);

// Ruta para obtener un proyecto por ID
router.get('/:id',authValidate, controller.verProyecto);

// Ruta para eliminar un proyecto por ID
router.delete('/:id',authValidate, controller.borrarProyecto);

// Ruta para obtener todos los proyectos 
router.get('/', authValidate, controller.verProyectos);

// Ruta para obtener todos los proyectos de un usuario
router.get('/user/:id', authValidate, controller.verProyectosDeUsuario);

export default router;
