import projectModel from '../models/project.model.js';

// http://localhost:8080/api/projects/ 

const crearProyecto = async (req, res) => {
    const project = req.body

    try {
        const projectSaved =  await projectModel.saveProject(project)
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
    /* 
        try {
            const project = new ProjectModel({
                title,
                description,
                amount,
                raised,
                userId: req.uid, // Almacena el ID del usuario que crea el proyecto
            });
    
            await project.save();
            res.status(201).json({
                ok: true,
                msg: 'Proyecto creado exitosamente',
                project,
            });
        } catch (error) {
            console.log(error);
           
        } */
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

export default {
    crearProyecto,
    verProyecto,
    verProyectos,
    borrarProyecto
}