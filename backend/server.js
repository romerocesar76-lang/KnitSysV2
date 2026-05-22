/**
 * KnitSys - Servidor Principal
 * API REST para gestión de empresas y contactos
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./src/config/database');
const routes = require('./src/routes');

// ═══════════════════════════════════════════
// CONFIGURACIÓN DEL SERVIDOR
// ═══════════════════════════════════════════

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Trust proxy para obtener IP real detrás de proxies (Render, etc.)
app.set('trust proxy', 1);

// ═══════════════════════════════════════════
// LOGGING DE PETICIONES (desarrollo)
// ═══════════════════════════════════════════

if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
    next();
  });
}

// ═══════════════════════════════════════════
// RUTAS
// ═══════════════════════════════════════════

// API routes
app.use('/api', routes);

// ═══════════════════════════════════════════
// MANEJO DE ERRORES
// ═══════════════════════════════════════════

// 404 - Ruta no encontrada
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.originalUrl}`,
    method: req.method
  });
});

// Error handler general
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ═══════════════════════════════════════════
// INICIO DEL SERVIDOR
// ═══════════════════════════════════════════

const startServer = async () => {
  try {
    // Probar conexión a la base de datos
    const dbConnected = await db.testConnection();
    
    if (!dbConnected) {
      console.warn('⚠️  No se pudo conectar a la base de datos. La API funcionará sin BD.');
    }
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log('');
      console.log('╔═══════════════════════════════════════════╗');
      console.log('║         KNITSYS API SERVER                ║');
      console.log('╠═══════════════════════════════════════════╣');
      console.log(`║  🚀 Servidor corriendo en puerto ${PORT}        ║`);
      console.log(`║  📡 API: http://localhost:${PORT}/api        ║`);
      console.log(`║  🏥 Health: http://localhost:${PORT}/health  ║`);
      console.log(`║  🌍 Entorno: ${process.env.NODE_ENV || 'development'}                    ║`);
      console.log(`║  💾 BD TiDB: ${dbConnected ? '✅ Conectada' : '❌ Desconectada'}           ║`);
      console.log('╚═══════════════════════════════════════════╝');
      console.log('');
      console.log('Endpoints disponibles:');
      console.log('  GET    /api/                    - Información de la API');
      console.log('  GET    /api/health              - Estado de salud');
      console.log('  GET    /api/empresas            - Listar empresas');
      console.log('  POST   /api/empresas            - Crear empresa');
      console.log('  GET    /api/contactos           - Listar contactos');
      console.log('  POST   /api/contactos           - Crear contacto');
      console.log('');
    });
    
    // Manejo de señales para cierre graceful
    process.on('SIGTERM', async () => {
      console.log('\n📡 Señal SIGTERM recibida. Cerrando servidor...');
      await db.closePool();
      process.exit(0);
    });
    
    process.on('SIGINT', async () => {
      console.log('\n📡 Señal SIGINT recibida. Cerrando servidor...');
      await db.closePool();
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Error fatal al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;