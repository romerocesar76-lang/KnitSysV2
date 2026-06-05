/**
 * KnitSys - Configuración de Rutas
 * Define todas las rutas de la API
 */

const express = require('express');
const router = express.Router();

// Controladores
const empresaController = require('../controllers/empresaController');
const contactoController = require('../controllers/contactoController');
const tipoContactoController = require('../controllers/tipoContactoController');

/**
 * @route   GET /api/
 * @desc    Endpoint de prueba
 * @access  Public
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'KnitSys API v1.0.0',
    timestamp: new Date().toISOString()
  });
});

/**
 * @route   GET /api/health
 * @desc    Verifica el estado de la API y conexión a BD
 * @access  Public
 */
router.get('/health', async (req, res) => {
  try {
    const db = require('../config/database');
    const dbConnected = await db.testConnection();
    
    res.json({
      success: true,
      status: 'OK',
      database: dbConnected ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 'ERROR',
      error: error.message
    });
  }
});

// ═══════════════════════════════════════════
// Rutas de Empresas
// ═══════════════════════════════════════════

/**
 * @route   GET /api/empresas
 * @desc    Obtener todas las empresas (con paginación)
 * @access  Public
 * @query   page, limit, search, activo
 */
router.get('/empresas', empresaController.getEmpresas);

/**
 * @route   GET /api/empresas/:id
 * @desc    Obtener empresa por ID
 * @access  Public
 */
router.get('/empresas/:id', empresaController.getEmpresaById);

/**
 * @route   GET /api/empresas/:id/contactos
 * @desc    Obtener contactos de una empresa
 * @access  Public
 */
router.get('/empresas/:id/contactos', empresaController.getContactosDeEmpresa);

/**
 * @route   POST /api/empresas
 * @desc    Crear nueva empresa
 * @access  Public (requiere autenticación en producción)
 * @body    nombre, cuit_rut_nif, condicion_fiscal, actividad_economica, sitio_web, country_code
 */
router.post('/empresas', empresaController.createEmpresa);

/**
 * @route   PUT /api/empresas/:id
 * @desc    Actualizar empresa
 * @access  Public (requiere autenticación en producción)
 */
router.put('/empresas/:id', empresaController.updateEmpresa);

/**
 * @route   PATCH /api/empresas/:id/activo
 * @desc    Activar/desactivar empresa
 * @access  Public (requiere autenticación en producción)
 */
router.patch('/empresas/:id/activo', empresaController.toggleActivo);

/**
 * @route   DELETE /api/empresas/:id
 * @desc    Eliminar empresa (soft delete)
 * @access  Public (requiere autenticación en producción)
 */
router.delete('/empresas/:id', empresaController.deleteEmpresa);

/**
 * @route   POST /api/empresas/:id/contactos
 * @desc    Vincular contacto a empresa
 * @access  Public (requiere autenticación en producción)
 */
router.post('/empresas/:id/contactos', empresaController.addContacto);

/**
 * @route   DELETE /api/empresas/:id/contactos/:contactoId
 * @desc    Desvincular contacto de empresa
 * @access  Public (requiere autenticación en producción)
 */
router.delete('/empresas/:id/contactos/:contactoId', empresaController.removeContacto);

// ═══════════════════════════════════════════
// Rutas de Contactos
// ═══════════════════════════════════════════

/**
 * @route   GET /api/contactos
 * @desc    Obtener todos los contactos (con paginación)
 * @access  Public
 * @query   page, limit, search, tipoContactoId, activo
 */
router.get('/contactos', contactoController.getContactos);

/**
 * @route   GET /api/contactos/:id
 * @desc    Obtener contacto por ID (con emails, teléfonos, empresas)
 * @access  Public
 */
router.get('/contactos/:id', contactoController.getContactoById);

/**
 * @route   POST /api/contactos
 * @desc    Crear nuevo contacto
 * @access  Public (requiere autenticación en producción)
 * @body    nombre, apellido, nombre_mostrar, id_tipo_contacto, resumen_notas, country_code
 */
router.post('/contactos', contactoController.createContacto);

/**
 * @route   PUT /api/contactos/:id
 * @desc    Actualizar contacto
 * @access  Public (requiere autenticación en producción)
 */
router.put('/contactos/:id', contactoController.updateContacto);

/**
 * @route   PATCH /api/contactos/:id/activo
 * @desc    Activar/desactivar contacto
 * @access  Public (requiere autenticación en producción)
 */
router.patch('/contactos/:id/activo', contactoController.toggleActivo);

/**
 * @route   DELETE /api/contactos/:id
 * @desc    Eliminar contacto (soft delete)
 * @access  Public (requiere autenticación en producción)
 */
router.delete('/contactos/:id', contactoController.deleteContacto);

/**
 * @route   POST /api/contactos/:id/emails
 * @desc    Agregar email a contacto
 * @access  Public (requiere autenticación en producción)
 */
router.post('/contactos/:id/emails', contactoController.addEmail);

/**
 * @route   DELETE /api/contactos/:id/emails/:emailId
 * @desc    Eliminar email de contacto
 * @access  Public (requiere autenticación en producción)
 */
router.delete('/contactos/:id/emails/:emailId', contactoController.removeEmail);

/**
 * @route   POST /api/contactos/:id/telefonos
 * @desc    Agregar teléfono a contacto
 * @access  Public (requiere autenticación en producción)
 */
router.post('/contactos/:id/telefonos', contactoController.addTelefono);

/**
 * @route   DELETE /api/contactos/:id/telefonos/:telefonoId
 * @desc    Eliminar teléfono de contacto
 * @access  Public (requiere autenticación en producción)
 */
router.delete('/contactos/:id/telefonos/:telefonoId', contactoController.removeTelefono);

// ═══════════════════════════════════════════
// Rutas de Tipos de Contacto
// ═══════════════════════════════════════════

/**
 * @route   GET /api/tipos-contacto
 * @desc    Obtener todos los tipos de contacto
 * @access  Public
 */
router.get('/tipos-contacto', tipoContactoController.getAll);

/**
 * @route   GET /api/tipos-contacto/:id
 * @desc    Obtener tipo de contacto por ID
 * @access  Public
 */
router.get('/tipos-contacto/:id', tipoContactoController.getById);

/**
 * @route   POST /api/tipos-contacto
 * @desc    Crear nuevo tipo de contacto
 * @access  Public (requiere autenticación en producción)
 * @body    etiqueta, descripcion
 */
router.post('/tipos-contacto', tipoContactoController.create);

/**
 * @route   PUT /api/tipos-contacto/:id
 * @desc    Actualizar tipo de contacto
 * @access  Public (requiere autenticación en producción)
 */
router.put('/tipos-contacto/:id', tipoContactoController.update);

/**
 * @route   DELETE /api/tipos-contacto/:id
 * @desc    Eliminar tipo de contacto
 * @access  Public (requiere autenticación en producción)
 */
router.delete('/tipos-contacto/:id', tipoContactoController.delete);

module.exports = router;