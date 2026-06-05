/**
 * KnitSys - Controlador TipoContacto
 * Maneja las peticiones HTTP para tipos_contacto
 */

const TipoContacto = require('../models/TipoContacto');

exports.getAll = async (req, res) => {
  try {
    const tipos = await TipoContacto.findAll();
    res.json({
      success: true,
      data: tipos,
    });
  } catch (error) {
    console.error('Error fetching tipos_contacto:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error al obtener los tipos de contacto',
    });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const tipo = await TipoContacto.findById(id);
    
    if (!tipo) {
      return res.status(404).json({
        success: false,
        error: 'Tipo de contacto no encontrado',
      });
    }
    
    res.json({
      success: true,
      data: tipo,
    });
  } catch (error) {
    console.error('Error fetching tipo_contacto:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error al obtener el tipo de contacto',
    });
  }
};

exports.create = async (req, res) => {
  try {
    const { etiqueta, descripcion } = req.body;
    
    const id = await TipoContacto.create({ etiqueta, descripcion });
    
    const newTipo = await TipoContacto.findById(id);
    
    res.status(201).json({
      success: true,
      data: newTipo,
    });
  } catch (error) {
    console.error('Error creating tipo_contacto:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Error al crear el tipo de contacto',
    });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { etiqueta, descripcion } = req.body;
    
    const exists = await TipoContacto.findById(id);
    if (!exists) {
      return res.status(404).json({
        success: false,
        error: 'Tipo de contacto no encontrado',
      });
    }
    
    const updated = await TipoContacto.update(id, { etiqueta, descripcion });
    
    if (!updated) {
      return res.status(400).json({
        success: false,
        error: 'No se pudo actualizar el tipo de contacto',
      });
    }
    
    const updatedTipo = await TipoContacto.findById(id);
    
    res.json({
      success: true,
      data: updatedTipo,
    });
  } catch (error) {
    console.error('Error updating tipo_contacto:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Error al actualizar el tipo de contacto',
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    
    const exists = await TipoContacto.findById(id);
    if (!exists) {
      return res.status(404).json({
        success: false,
        error: 'Tipo de contacto no encontrado',
      });
    }
    
    const deleted = await TipoContacto.delete(id);
    
    if (!deleted) {
      return res.status(400).json({
        success: false,
        error: 'No se pudo eliminar el tipo de contacto',
      });
    }
    
    res.json({
      success: true,
      message: 'Tipo de contacto eliminado',
    });
  } catch (error) {
    console.error('Error deleting tipo_contacto:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error al eliminar el tipo de contacto',
    });
  }
};
