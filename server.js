import express from 'express';
import 'dotenv/config';
import mongoose from 'mongoose';
import routerAuth from './routers/auth.routes.js';
import authValidate from './middlewares/auth.validate.js';
import routerProject from './routers/project.routes.js';

// ! Constantes/Variables
const app = express();
const PORT = process.env.PORT;
const CONECCTION_REMOTO = process.env.MONGO_REMOTO;

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