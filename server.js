import express from 'express';
import 'dotenv/config';
import mongoose from 'mongoose';
import routerAuth from './routers/auth.routes.js';
import authValidate from './middlewares/auth.validate.js';
import routerProject from './routers/project.routes.js';
import cors from 'cors'

// ! Constantes/Variables
const app = express();
const PORT = process.env.PORT;
const CONECCTION_REMOTO = process.env.MONGO_REMOTO;
const ORIGIN = process.env.ORIGIN

// ! Conectandose a Mongo
const handleConnection = async () => {
  try {
    await mongoose.connect(CONECCTION_REMOTO);
    console.log('DB funcionando');
  } catch (error) {
    console.log(`Error a la hora de conectarse a la DB ${error}`);
  }
};

// ! Middleware
app.use(express.static('./public'));
app.use(express.json());

app.use(cors())
/* 
const corsOptions = {
  origin: ORIGIN,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
} */
// ! Rutas
app.use('/api/auth', routerAuth); // Rutas de autenticación

// Rutas de proyectos protegidas por autenticación
app.use('/api/projects', authValidate, routerProject); 

// ! Arranque del servidor
app.listen(PORT, (err) => {
  if (err) throw new Error(`No se pudo levantar el servidor -> ${err}`);
  console.log(`La aplicación arrancó -> http://localhost:${PORT}`);
  handleConnection();
});