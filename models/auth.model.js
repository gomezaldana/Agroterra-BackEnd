import mongoose from "mongoose"
import bcrypt from 'bcrypt'

const AuthSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true, // createAt y udpatedAt
        versionKey: false
    }
)

// Métodos de los esquemas

AuthSchema.methods.encriptarPassword = async (password) => {
    const salt = await bcrypt.genSalt(10) // <= la semilla
    return await bcrypt.hash(password, salt)
}

AuthSchema.methods.comprobarPassword = async function(password) {
    return await bcrypt.compare(password, this.password)
}

const AuthModel = mongoose.model('auth', AuthSchema)

/* -------------------------------------- */

const getUsuarioByEmail = async (email) => {
    try {
        
        const usuario = await AuthModel.findOne({ email })
        return usuario

    } catch (error) {
        console.log('[getUsuarioByEmail]: No se pudo obtener el usuario', error)
    }
}

const createUsuario = async (nuevoUsuario) => {

    try {
        const usuario = new AuthModel(nuevoUsuario)
        usuario.password = await usuario.encriptarPassword(nuevoUsuario.password)
        await usuario.save()
        return usuario
    } catch (error) {
        console.log('[createUsuario]: No se pudo crear el usuario', error)
    }

}

const checkUsuarioPassword = async (usuario, password) => {

    try {
        const isMatch = await usuario.comprobarPassword(password) 
        return isMatch
    } catch (error) {
        console.log('[]: Algo sucedio cuando quisimos verificar el password', error)        
    }

}

export default {
    getUsuarioByEmail, 
    createUsuario, 
    checkUsuarioPassword
}









