/**
 * KnitSys - Servicio API
 * Configuración de Axios para conectar con el backend
 */

import axios from 'axios';

// URL del backend (cambiar en producción)
const API_URL = import.meta.env.VITE_API_URL || '/api';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos
});

// Interceptor para agregar token de autenticación (futuro)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o no autorizado
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ═══════════════════════════════════════════
// SERVICIOS DE EMPRESAS
// ═══════════════════════════════════════════

export const empresaService = {
  // Obtener todas las empresas
  getAll: (params = {}) => {
    return api.get('/empresas', { params });
  },

  // Obtener empresa por ID
  getById: (id) => {
    return api.get(`/empresas/${id}`);
  },

  // Obtener contactos de una empresa
  getContactos: (id) => {
    return api.get(`/empresas/${id}/contactos`);
  },

  // Crear empresa
  create: (data) => {
    return api.post('/empresas', data);
  },

  // Actualizar empresa
  update: (id, data) => {
    return api.put(`/empresas/${id}`, data);
  },

  // Activar/desactivar empresa
  toggleActivo: (id, activo) => {
    return api.patch(`/empresas/${id}/activo`, { activo });
  },

  // Eliminar empresa
  delete: (id) => {
    return api.delete(`/empresas/${id}`);
  },

  // Vincular contacto a empresa
  addContacto: (id, contactoId, data) => {
    return api.post(`/empresas/${id}/contactos`, { contactoId, ...data });
  },

  // Desvincular contacto
  removeContacto: (id, contactoId) => {
    return api.delete(`/empresas/${id}/contactos/${contactoId}`);
  },
};

// ═══════════════════════════════════════════
// SERVICIOS DE CONTACTOS
// ═══════════════════════════════════════════

export const contactoService = {
  // Obtener todos los contactos
  getAll: (params = {}) => {
    return api.get('/contactos', { params });
  },

  // Obtener contacto por ID (con emails, teléfonos, empresas)
  getById: (id) => {
    return api.get(`/contactos/${id}`);
  },

  // Crear contacto
  create: (data) => {
    return api.post('/contactos', data);
  },

  // Actualizar contacto
  update: (id, data) => {
    return api.put(`/contactos/${id}`, data);
  },

  // Activar/desactivar contacto
  toggleActivo: (id, activo) => {
    return api.patch(`/contactos/${id}/activo`, { activo });
  },

  // Eliminar contacto
  delete: (id) => {
    return api.delete(`/contactos/${id}`);
  },

  // Agregar email
  addEmail: (id, data) => {
    return api.post(`/contactos/${id}/emails`, data);
  },

  // Eliminar email
  removeEmail: (id, emailId) => {
    return api.delete(`/contactos/${id}/emails/${emailId}`);
  },

  // Agregar teléfono
  addTelefono: (id, data) => {
    return api.post(`/contactos/${id}/telefonos`, data);
  },

  // Eliminar teléfono
  removeTelefono: (id, telefonoId) => {
    return api.delete(`/contactos/${id}/telefonos/${telefonoId}`);
  },
};

// ═══════════════════════════════════════════
// SERVICIO DE HEALTH CHECK
// ═══════════════════════════════════════════

export const healthService = {
  check: () => {
    return api.get('/health');
  },
};

export default api;