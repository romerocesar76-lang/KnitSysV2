/**
 * KnitSys - Controlador de Empresas
 * Maneja las peticiones HTTP relacionadas con empresas
 */

const Empresa = require('../models/Empresa');

/**
 * Obtiene todas las empresas con paginación y filtros
 * GET /api/empresas
 */
const getEmpresas = async (req, res) => {
  try {
    const { page, limit, search, activo } = req.query;
    
    const options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
      search: search || '',
      activo: activo !== undefined ? activo === 'true' : undefined
    };
    
    const empresas = await Empresa.findAll(options);
    
    res.json({
      success: true,
      data: empresas,
      pagination: {
        page: options.page,
        limit: options.limit
      }
    });
  } catch (error) {
    console.error('Error obteniendo empresas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las empresas',
      error: error.message
    });
  }
};

/**
 * Obtiene una empresa por ID
 * GET /api/empresas/:id
 */
const getEmpresaById = async (req, res) => {
  try {
    const { id } = req.params;
    const empresa = await Empresa.findById(id);
    
    if (!empresa) {
      return res.status(404).json({
        success: false,
        message: 'Empresa no encontrada'
      });
    }
    
    res.json({
      success: true,
      data: empresa
    });
  } catch (error) {
    console.error('Error obteniendo empresa:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener la empresa',
      error: error.message
    });
  }
};

/**
 * Obtiene los contactos de una empresa
 * GET /api/empresas/:id/contactos
 */
const getContactosDeEmpresa = async (req, res) => {
  try {
    const { id } = req.params;
    const empresa = await Empresa.findById(id);
    
    if (!empresa) {
      return res.status(404).json({
        success: false,
        message: 'Empresa no encontrada'
      });
    }
    
    const contactos = await Empresa.findContactos(id);
    
    res.json({
      success: true,
      data: contactos
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
 * Crea una nueva empresa
 * POST /api/empresas
 */
const createEmpresa = async (req, res) => {
  try {
    const {
      nombre,
      cuit_rut_nif,
      condicion_fiscal,
      actividad_economica,
      sitio_web,
      country_code
    } = req.body;
    
    // Validación básica
    if (!nombre || nombre.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'El nombre de la empresa es obligatorio'
      });
    }
    
    const empresaId = await Empresa.create({
      nombre: nombre.trim(),
      cuit_rut_nif,
      condicion_fiscal,
      actividad_economica,
      sitio_web,
      country_code,
      creado_por: req.usuario?.id || null // Si hay autenticación
    });
    
    const nuevaEmpresa = await Empresa.findById(empresaId);
    
    res.status(201).json({
      success: true,
      message: 'Empresa creada exitosamente',
      data: nuevaEmpresa
    });
  } catch (error) {
    console.error('Error creando empresa:', error);
    
    // Manejar error de duplicado (CUIT/RUT/NIF)
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: 'Ya existe una empresa con ese CUIT/RUT/NIF'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error al crear la empresa',
      error: error.message
    });
  }
};

/**
 * Actualiza una empresa
 * PUT /api/empresas/:id
 */
const updateEmpresa = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    
    // Verificar que la empresa existe
    const empresaExistente = await Empresa.findById(id);
    if (!empresaExistente) {
      return res.status(404).json({
        success: false,
        message: 'Empresa no encontrada'
      });
    }
    
    const actualizado = await Empresa.update(id, data, req.usuario?.id || null);
    
    if (!actualizado) {
      return res.status(400).json({
        success: false,
        message: 'No se pudo actualizar la empresa'
      });
    }
    
    const empresaActualizada = await Empresa.findById(id);
    
    res.json({
      success: true,
      message: 'Empresa actualizada exitosamente',
      data: empresaActualizada
    });
  } catch (error) {
    console.error('Error actualizando empresa:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar la empresa',
      error: error.message
    });
  }
};

/**
 * Elimina una empresa (soft delete)
 * DELETE /api/empresas/:id
 */
const deleteEmpresa = async (req, res) => {
  try {
    const { id } = req.params;
    
    const empresaExistente = await Empresa.findById(id);
    if (!empresaExistente) {
      return res.status(404).json({
        success: false,
        message: 'Empresa no encontrada'
      });
    }
    
    const eliminado = await Empresa.delete(id);
    
    if (!eliminado) {
      return res.status(400).json({
        success: false,
        message: 'No se pudo eliminar la empresa'
      });
    }
    
    res.json({
      success: true,
      message: 'Empresa eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando empresa:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar la empresa',
      error: error.message
    });
  }
};

/**
 * Activa o desactiva una empresa
 * PATCH /api/empresas/:id/activo
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
    
    const actualizado = await Empresa.toggleActivo(id, activo);
    
    if (!actualizado) {
      return res.status(404).json({
        success: false,
        message: 'Empresa no encontrada'
      });
    }
    
    res.json({
      success: true,
      message: `Empresa ${activo ? 'activada' : 'desactivada'} exitosamente`
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
 * Vincula un contacto a una empresa
 * POST /api/empresas/:id/contactos
 */
const addContacto = async (req, res) => {
  try {
    const { id: empresaId } = req.params;
    const { contactoId, puesto, es_principal, notas } = req.body;
    
    // Verificar que la empresa existe
    const empresa = await Empresa.findById(empresaId);
    if (!empresa) {
      return res.status(404).json({
        success: false,
        message: 'Empresa no encontrada'
      });
    }
    
    if (!contactoId) {
      return res.status(400).json({
        success: false,
        message: 'El ID del contacto es obligatorio'
      });
    }
    
    const relacionId = await Empresa.addContacto(empresaId, contactoId, {
      puesto,
      es_principal: es_principal || false,
      notas,
      creado_por: req.usuario?.id || null
    });
    
    res.status(201).json({
      success: true,
      message: 'Contacto vinculado exitosamente',
      data: { id: relacionId }
    });
  } catch (error) {
    console.error('Error vinculando contacto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al vincular el contacto',
      error: error.message
    });
  }
};

/**
 * Desvincula un contacto de una empresa
 * DELETE /api/empresas/:id/contactos/:contactoId
 */
const removeContacto = async (req, res) => {
  try {
    const { id: empresaId, contactoId } = req.params;
    
    const eliminado = await Empresa.removeContacto(empresaId, contactoId);
    
    if (!eliminado) {
      return res.status(404).json({
        success: false,
        message: 'Relación no encontrada'
      });
    }
    
    res.json({
      success: true,
      message: 'Contacto desvinculado exitosamente'
    });
  } catch (error) {
    console.error('Error desvinculando contacto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al desvincular el contacto',
      error: error.message
    });
  }
};

module.exports = {
  getEmpresas,
  getEmpresaById,
  getContactosDeEmpresa,
  createEmpresa,
  updateEmpresa,
  deleteEmpresa,
  toggleActivo,
  addContacto,
  removeContacto
};