import mongoose from 'mongoose';

const ProjectSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        raised: {
            type: Number,
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'auth',
            required: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const ProjectModel = mongoose.model('Project', ProjectSchema);

/* ------- Methods ------- */

const getProject = async (id) => {

    try {
        return await ProjectModel.findById(id)

    } catch (error) {
        throw new Error('Error al obtener el proyecto');
    }
}

const allProjectsFromUser = async (id) => {

    try {
        return await ProjectModel.find({ userId: userId });

    } catch (error) {
        throw new Error(`Error al obtener los proyectos del usuario ${id}`);
    }
}

const allProjects = async () => {

    try {
        return await ProjectModel.find();
    } catch (error) {
        throw new Error('Error al obtener proyectos');

    }

}
const saveProject = async (newProject) => {
    try {
        const project = new ProjectModel(newProject); 
        await project.save();
        return project;
    } catch (error) {
        throw new Error('Error al crear el proyecto');
    } 
}

const deleteProject = async (id) => {
    try {
        const project = await ProjectModel.findByIdAndDelete(id);
        return project
    } catch (error) {
        throw new Error('Error al eliminar el proyecto');

    }
}

export default {
    saveProject,
    allProjects,
    getProject,
    deleteProject,
    allProjectsFromUser
}





