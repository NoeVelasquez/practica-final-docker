const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Configuración de base de datos con charset utf8mb4 explícito
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'cv_user',
  password: process.env.DB_PASSWORD || 'cv_password',
  database: process.env.DB_NAME || 'cv_db',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  charset: 'utf8mb4',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

let pool = null;

// Middleware
app.use(cors());
app.use(express.json());

// Middleware para forzar cabecera de codificación UTF-8 en todas las respuestas JSON
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

// Función para inicializar y verificar conexión a MySQL con soporte de reintentos
async function initDatabaseConnection(retries = 10, delayMs = 3000) {
  for (let i = 1; i <= retries; i++) {
    try {
      console.log(`[DB] Intentando conectar a MySQL en ${dbConfig.host}:${dbConfig.port} (Intento ${i}/${retries})...`);
      pool = mysql.createPool(dbConfig);
      const connection = await pool.getConnection();
      await connection.query("SET NAMES 'utf8mb4'");
      await connection.query("SET CHARACTER SET utf8mb4");
      console.log('✅ [DB] Conexión establecida exitosamente con MySQL (UTF-8 activado).');
      connection.release();
      return true;
    } catch (err) {
      console.error(`❌ [DB] Error conectando a MySQL: ${err.message}`);
      if (i === retries) {
        console.error('💥 [DB] No se pudo conectar a la base de datos tras múltiples intentos.');
        return false;
      }
      console.log(`⏳ [DB] Reintentando en ${delayMs / 1000} segundos...`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

// Endpoint de Salud
app.get('/health', async (req, res) => {
  try {
    if (!pool) {
      return res.status(503).json({ status: 'error', message: 'DB Pool no inicializado' });
    }
    await pool.query('SELECT 1');
    return res.status(200).json({ status: 'ok', database: 'connected', timestamp: new Date() });
  } catch (error) {
    return res.status(503).json({ status: 'error', message: error.message });
  }
});

// Endpoint principal requerido: GET /cv
app.get('/cv', async (req, res) => {
  try {
    if (!pool) {
      return res.status(503).json({ error: 'Conexión a base de datos no disponible' });
    }

    // Consulta de datos personales de la tabla persona
    const [personas] = await pool.query('SELECT id, nombre, apellido, ciudad, foto, profesion, email, telefono, linkedin, github FROM persona LIMIT 1');
    if (personas.length === 0) {
      return res.status(404).json({ error: 'No se encontraron datos personales registrados en la tabla persona' });
    }

    const persona = personas[0];

    // Consulta de la lista de formación académica de la tabla formacion
    const [formacion] = await pool.query(
      'SELECT id, titulo, institucion, anio FROM formacion WHERE persona_id = ? ORDER BY id ASC',
      [persona.id]
    );

    // Respuesta con el formato consolidado
    return res.status(200).json({
      persona: persona,
      formacion: formacion,
    });
  } catch (error) {
    console.error('Error al procesar GET /cv:', error);
    return res.status(500).json({
      error: 'Error interno del servidor al consultar la base de datos',
      details: error.message,
    });
  }
});

// Iniciar servidor
app.listen(PORT, async () => {
  console.log(`🚀 [Backend] Servidor escuchando en http://0.0.0.0:${PORT}`);
  console.log(`📡 [Backend] Endpoint disponible en http://0.0.0.0:${PORT}/cv`);
  await initDatabaseConnection();
});
