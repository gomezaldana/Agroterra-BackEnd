import projectModel from '../models/project.model.js';

// http://localhost:8080/api/projects/ 

const crearProyecto = async (req, res) => { 
    const project = req.body
     // Si hay imágenes en la solicitud, las procesamos
     const images = req.files ? req.files.map(file => ({
        data: file.buffer.toString('base64'),
        contentType: file.mimetype
    })) : [];

    try {
        const projectSaved =  await projectModel.saveProject(project, images)
        res.status(201).json({
            ok: true,
            msg: 'Proyecto creado exitosamente',
            project: projectSaved,

        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error al crear el proyecto',
        });
    }
}

// http://localhost:8080/api/projects/id 
const verProyecto = async (req, res) => {
    const id = req.params.id;
    try {
        const project = await projectModel.getProject(id)
        if (!project) {
            return res.status(404).json({
                ok: false,
                msg: 'Proyecto no encontrado'
            });
        }
       
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error al obtener el proyecto'
        });
    }
}

// http://localhost:8080/api/projects/id

const borrarProyecto = async (req, res) => {

    const id = req.params.id;

    try {

        const project = await projectModel.deleteProject(id)
        if (!project) {
            return res.status(404).json({
                ok: false,
                msg: 'Proyecto no encontrado o no autorizado'
            });
        }

        res.status(200).json({
            ok: true,
            msg: 'Proyecto eliminado exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error al eliminar el proyecto'
        });
    }
}
// http://localhost:8080/api/projects/ 

const verProyectos = async (req, res) => {
    try {
        const projects = await projectModel.allProjects()
        res.status(200).json({
            ok: true,
            projects,
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error al obtener proyectos',
        });
    }

}
// http://localhost:8080/api/projects/user/id 

const verProyectosDeUsuario = async (req, res) => {
    const idUser = req.params.id;

    try {
        const projects = await projectModel.allProjectsFromUser(idUser)
        res.status(200).json({
            ok: true,
            projects,
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: `Error al obtener proyectos del usuario ${idUser}`,
        });
    }

}

export default {
    crearProyecto,
    verProyecto,
    verProyectos,
    borrarProyecto,
    verProyectosDeUsuario
}