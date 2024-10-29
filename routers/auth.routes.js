import express from 'express'
const routerAuth = express.Router()
import controller from '../controllers/auth.controller.js'

routerAuth.post('/create', controller.crearUsuario)

routerAuth.post('/login', controller.loginUsuario)

export default routerAuth