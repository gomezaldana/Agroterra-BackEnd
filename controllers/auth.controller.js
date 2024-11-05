import models from '../models/auth.model.js'
import generarJwt from '../utils/generar-jwt.js'

// http://localhost:8080/api/auth/create 
const crearUsuario = async (req, res) => {
    console.log(req.body)
    const { email, password, name, lastName } = req.body
    
    try {
        
        // verifico si el usuario existe en los registros
        let usuario = await models.getUsuarioByEmail(email)
        
        if ( usuario ) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario ya existe'
            })
        }
        
        // creo el usuario
        usuario = await models.createUsuario({email, password, name,lastName})
        
        // genero  token
        
        const token = await generarJwt(usuario.id, usuario.name)
        
        res.status(201).json(
            {
                ok: true,
                mensaje: 'El usuario se creo correctamente',
                uid: usuario.id,
                name: usuario.name,
                lastName: usuario.lastName,
                token,
            }
        )
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'No se pudo crear el usuario'
        })
    }
}

const encontrarUsuarioPorId = async (req, res) => {
    const id =req.params.id 
    try {
        const usuario = await models.getUsuarioById(id)
        if ( !usuario ) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe en nuestro registros'
            })
        }
        res.status(200).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            lastName: usuario.lastName,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'No se pudo encontrar al usuario'
        })
    }
}

// http://localhost:8080/api/auth/login 
const loginUsuario = async (req, res) => {

    const { email, password } = req.body
    console.log(req.body)
    try {
        
        // ! Revisar si el usuario esta dentro de nuestros registros
        const usuario = await models.getUsuarioByEmail(email)

        if ( !usuario ) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe en nuestro registros'
            })
        }

        // ! Corroboro que el password ingreado en el login coincida con el que está almacenado en la db
        const passwordValido = await models.checkUsuarioPassword(usuario, password)

        if ( !passwordValido ) {
            return res.status(400).json({
                ok: false,
                msg: 'No coincide la contraseña'
            })
        }

        // !si es válido

        const token = await generarJwt( usuario.id, usuario.name )

        res.status(200).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            name: usuario.lastName,
            token // hay q guardarlo en el front con el fetch
        })
    
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'No se pudo loguear con exito'
        })
    }
    
}

export default {
    crearUsuario,
    loginUsuario,
    encontrarUsuarioPorId
}