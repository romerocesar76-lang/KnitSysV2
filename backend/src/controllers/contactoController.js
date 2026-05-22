/**
 * KnitSys - Controlador de Contactos
 * Maneja las peticiones HTTP relacionadas con contactos (individuos)
 */

const Contacto = require('../models/Contacto');

/**
 * Obtiene todos los contactos con paginación y filtros
 * GET /api/contactos
 */
const getContactos = async (req, res) => {
  try {
    const { page, limit, search, tipoContactoId, activo } = req.query;
    
    const options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
      search: search || '',
      tipoContactoId: tipoContactoId ? parseInt(tipoContactoId) : null,
      activo: activo !== undefined ? activo === 'true' : undefined
    };
    
    const contactos = await Contacto.findAll(options);
    
    res.json({
      success: true,
      data: contactos,
      pagination: {
        page: options.page,
        limit: options.limit
      }
    });
  } catch (error) {
    console.error('Error obteniendo contactos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los contactos',
      error: error.message
    });
  }
};

/**
 * Obtiene un contacto por ID con toda su información relacionada
 * GET /api/contactos/:id
 */
const getContactoById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const contacto = await Contacto.findById(id);
    if (!contacto) {
      return res.status(404).json({
        success: false,
        message: 'Contacto no encontrado'
      });
    }
    
    // Obtener emails, teléfonos y empresas relacionadas
    const [emails, telefonos, empresas] = await Promise.all([
      Contacto.findEmails(id),
      Contacto.findTelefonos(id),
      Contacto.findEmpresas(id)
    ]);
    
    res.json({
      success: true,
      data: {
        ...contacto,
        emails,
        telefonos,
        empresas
      }
    });
  } catch (error) {
    console.error('Error obteniendo contacto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el contacto',
      error: error.message
    });
  }
};

/**
 * Crea un nuevo contacto
 * POST /api/contactos
 */
const createContacto = async (req, res) => {
  try {
    const {
      nombre,
      apellido,
      nombre_mostrar,
      id_tipo_contacto,
      resumen_notas,
      country_code
    } = req.body;
    
    // Validación básica
    if ((!nombre || nombre.trim() === '') && (!apellido || apellido.trim() === '')) {
      return res.status(400).json({
        success: false,
        message: 'El nombre o apellido del contacto es obligatorio'
      });
    }
    
    const contactoId = await Contacto.create({
      nombre: nombre?.trim() || null,
      apellido: apellido?.trim() || null,
      nombre_mostrar: nombre_mostrar?.trim() || null,
      id_tipo_contacto,
      resumen_notas,
      country_code,
      creado_por: req.usuario?.id || null
    });
    
    const nuevoContacto = await Contacto.findById(contactoId);
    
    res.status(201).json({
      success: true,
      message: 'Contacto creado exitosamente',
      data: nuevoContacto
    });
  } catch (error) {
    console.error('Error creando contacto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear el contacto',
      error: error.message
    });
  }
};

/**
 * Actualiza un contacto
 * PUT /api/contactos/:id
 */
const updateContacto = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    
    // Verificar que el contacto existe
    const contactoExistente = await Contacto.findById(id);
    if (!contactoExistente) {
      return res.status(404).json({
        success: false,
        message: 'Contacto no encontrado'
      });
    }
    
    const actualizado = await Contacto.update(id, data, req.usuario?.id || null);
    
    if (!actualizado) {
      return res.status(400).json({
        success: false,
        message: 'No se pudo actualizar el contacto'
      });
    }
    
    const contactoActualizado = await Contacto.findById(id);
    
    res.json({
      success: true,
      message: 'Contacto actualizado exitosamente',
      data: contactoActualizado
    });
  } catch (error) {
    console.error('Error actualizando contacto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el contacto',
      error: error.message
    });
  }
};

/**
 * Elimina un contacto (soft delete)
 * DELETE /api/contactos/:id
 */
const deleteContacto = async (req, res) => {
  try {
    const { id } = req.params;
    
    const contactoExistente = await Contacto.findById(id);
    if (!contactoExistente) {
      return res.status(404).json({
        success: false,
        message: 'Contacto no encontrado'
      });
    }
    
    const eliminado = await Contacto.delete(id);
    
    if (!eliminado) {
      return res.status(400).json({
        success: false,
        message: 'No se pudo eliminar el contacto'
      });
    }
    
    res.json({
      success: true,
      message: 'Contacto eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando contacto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el contacto',
      error: error.message
    });
  }
};

/**
 * Activa o desactiva un contacto
 * PATCH /api/contactos/:id/activo
 */
const toggleActivo = async (req, res) => {
  try {
    const { id } = req.params;
    const { activo } = req.body;
    
    if (activo === undefined) {
      return res.status(400).json({
        success: false,
        message: 'El campo "activo" es obligatorio'
      });
    }
    
    const actualizado = await Contacto.toggleActivo(id, activo);
    
    if (!actualizado) {
      return res.status(404).json({
        success: false,
        message: 'Contacto no encontrado'
      });
    }
    
    res.json({
      success: true,
      message: `Contacto ${activo ? 'activado' : 'desactivado'} exitosamente`
    });
  } catch (error) {
    console.error('Error cambiando estado:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cambiar el estado',
      error: error.message
    });
  }
};

/**
 * Agrega un email a un contacto
 * POST /api/contactos/:id/emails
 */
const addEmail = async (req, res) => {
  try {
    const { id: contactoId } = req.params;
    const { correo, tipo, es_principal, verificado } = req.body;
    
    // Verificar que el contacto existe
    const contacto = await Contacto.findById(contactoId);
    if (!contacto) {
      return res.status(404).json({
        success: false,
        message: 'Contacto no encontrado'
      });
    }
    
    if (!correo || correo.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'El email es obligatorio'
      });
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      return res.status(400).json({
        success: false,
        message: 'El formato del email no es válido'
      });
    }
    
    const emailId = await Contacto.addEmail(contactoId, {
      correo: correo.trim(),
      tipo: tipo || 'personal',
      es_principal: es_principal || false,
      verificado: verificado || false
    });
    
    res.status(201).json({
      success: true,
      message: 'Email agregado exitosamente',
      data: { id: emailId, correo: correo.trim() }
    });
  } catch (error) {
    console.error('Error agregando email:', error);
    res.status(500).json({
      success: false,
      message: 'Error al agregar el email',
      error: error.message
    });
  }
};

/**
 * Elimina un email de un contacto
 * DELETE /api/contactos/:id/emails/:emailId
 */
const removeEmail = async (req, res) => {
  try {
    const { id: contactoId, emailId } = req.params;
    
    const eliminado = await Contacto.removeEmail(contactoId, emailId);
    
    if (!eliminado) {
      return res.status(404).json({
        success: false,
        message: 'Email no encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Email eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando email:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el email',
      error: error.message
    });
  }
};

/**
 * Agrega un teléfono a un contacto
 * POST /api/contactos/:id/telefonos
 */
const addTelefono = async (req, res) => {
  try {
    const { id: contactoId } = req.params;
    const { telefono, country_code, tipo, es_principal } = req.body;
    
    // Verificar que el contacto existe
    const contacto = await Contacto.findById(contactoId);
    if (!contacto) {
      return res.status(404).json({
        success: false,
        message: 'Contacto no encontrado'
      });
    }
    
    if (!telefono || telefono.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'El teléfono es obligatorio'
      });
    }
    
    const telefonoId = await Contacto.addTelefono(contactoId, {
      telefono: telefono.trim(),
      country_code: country_code || null,
      tipo: tipo || 'movil',
      es_principal: es_principal || false
    });
    
    res.status(201).json({
      success: true,
      message: 'Teléfono agregado exitosamente',
      data: { id: telefonoId, telefono: telefono.trim() }
    });
  } catch (error) {
    console.error('Error agregando teléfono:', error);
    res.status(500).json({
      success: false,
      message: 'Error al agregar el teléfono',
      error: error.message
    });
  }
};

/**
 * Elimina un teléfono de un contacto
 * DELETE /api/contactos/:id/telefonos/:telefonoId
 */
const removeTelefono = async (req, res) => {
  try {
    const { id: contactoId, telefonoId } = req.params;
    
    const eliminado = await Contacto.removeTelefono(contactoId, telefonoId);
    
    if (!eliminado) {
      return res.status(404).json({
        success: false,
        message: 'Teléfono no encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Teléfono eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando teléfono:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el teléfono',
      error: error.message
    });
  }
};

module.exports = {
  getContactos,
  getContactoById,
  createContacto,
  updateContacto,
  deleteContacto,
  toggleActivo,
  addEmail,
  removeEmail,
  addTelefono,
  removeTelefono
};