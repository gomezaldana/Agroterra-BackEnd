import express from 'express';
import 'dotenv/config';
import mongoose from 'mongoose';
import routerAuth from './routers/auth.routes.js';
import authValidate from './middlewares/auth.validate.js';
import routerProject from './routers/project.routes.js';
import cors from 'cors';

// MercadoPago
import { MercadoPagoConfig, Preference } from 'mercadopago';

// ! Constantes/Variables
const app = express();
const PORT = process.env.PORT || 8080;  
const CONECCTION_REMOTO = process.env.MONGO_REMOTO;  
const ORIGIN = process.env.ORIGIN ;  

// Configuración de MercadoPago
const client = new MercadoPagoConfig({
  accessToken: "APP_USR-7128906689737357-110719-fb11ddc5c550b09f5f12c8e160d332bd-2085279446"
});

// ! Middleware
app.use(express.static('./public'));  
app.use(express.json());  


app.use(cors())

// ! Conexión con MongoDB
const handleConnection = async () => {
  try {
    await mongoose.connect(CONECCTION_REMOTO);
    console.log('Conexión a la base de datos establecida');
  } catch (error) {
    console.error(`Error al conectarse a la DB: ${error}`);
  }
};

// ! Rutas
app.use('/api/auth', routerAuth);  // Rutas de autenticación
app.use('/api/projects', authValidate, routerProject);  // Rutas de proyectos que solicitan token


// ? -----------------------------------------------------------------------------
// ? -----------------Pago por mercado pago---------------------------
// ? -----------------------------------------------------------------------------


// Rutas para verificación
app.get('/success', (req, res) => {
  res.send('Pago exitoso');
});

app.get('/failure', (req, res) => {
  res.send('Pago fallido');
});

app.get('/pending', (req, res) => {
  res.send('Pago pendiente');
});


app.post('/create_preference', async (req, res) => {
  const { amount, title } = req.body;

  if (!amount || !title) {
    return res.status(400).json({ error: 'Faltan datos requeridos (amount o title)' });
  }

  const body = {
    items: [
      {
        title: title,
        quantity: 1,
        unit_price: 100,
        currency_id: 'ARS',
      },
    ],
    back_urls: {
      success: 'http://localhost:8080/success',
      failure: 'http://localhost:8080/failure',
      pending: 'http://localhost:8080/pending',
    },
    auto_return: 'approved',
  };

  try {
    // Crear la preferencia de pago
    const preference = await new Preference(client).create({ body });

    // Log completo de la respuesta para más detalles
    console.log('Respuesta completa de Mercado Pago:', preference);

    if (preference.id) {
      // ID de la preferencia y la URL de inicio
      res.json({
        preferenceId: preference.id,
        redirectUrl: preference.init_point,  // URL donde el usuario debe ir para realizar el pago
      });
    } else {
      throw new Error('La preferencia no contiene un ID válido.');
    }
  } catch (error) {
    console.error('Error creando la preferencia:', error);
    res.status(500).json({ error: 'Error al crear la preferencia de pago' });
  }
});

// ? -----------------------------------------------------------------------------
// ? -----------------------------------------------------------------------------
// ? -----------------------------------------------------------------------------

// ! Arranque del servidor
app.listen(PORT, (err) => {
  if (err) throw new Error(`No se pudo levantar el servidor -> ${err}`);
  console.log(`La aplicación arrancó en -> http://localhost:${PORT}`);
  handleConnection();
});