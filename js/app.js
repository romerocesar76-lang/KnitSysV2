/**
 * KnitSys - Aplicación Principal
 * Versión: 1.0.0
 * 
 * Módulo principal de la aplicación con encapsulamiento
 * para evitar contaminación del ámbito global
 */

(function() {
  'use strict';

  // ═══════════════════════════════════════════
  // CONFIGURACIÓN Y ESTADO
  // ═══════════════════════════════════════════
  
  const CONFIG = {
    pages: {
      home:       { title: 'Inicio',          crumb: 'KnitSys / Inicio' },
      contactos:  { title: 'Contactos',       crumb: 'KnitSys / Contactos' },
      hilados:    { title: 'Hilados',         crumb: 'KnitSys / Inventario / Hilados' },
      stock:      { title: 'Stock',           crumb: 'KnitSys / Inventario / Stock' },
      plan:       { title: 'Plan de trabajo', crumb: 'KnitSys / Plan de trabajo' },
      desarrollos:{ title: 'Desarrollos',     crumb: 'KnitSys / Desarrollos' },
      config:     { title: 'Configuración',   crumb: 'KnitSys / Configuración' },
    },
    toastDuration: 2800,
    animationDuration: 300
  };

  // ═══════════════════════════════════════════
  // UTILIDADES
  // ═══════════════════════════════════════════
  
  /**
   * Valida un formulario antes de enviar
   * @param {HTMLFormElement} form - El formulario a validar
   * @returns {boolean} - True si es válido
   */
  function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    // Limpiar errores previos
    form.querySelectorAll('.form-error').forEach(el => el.remove());
    form.querySelectorAll('.form-input.error').forEach(el => el.classList.remove('error'));
    
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        isValid = false;
        field.classList.add('error');
        
        const errorEl = document.createElement('div');
        errorEl.className = 'form-error';
        errorEl.textContent = 'Este campo es obligatorio';
        field.parentNode.appendChild(errorEl);
      }
      
      // Validación de email
      if (field.type === 'email' && field.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
          isValid = false;
          field.classList.add('error');
          
          const errorEl = document.createElement('div');
          errorEl.className = 'form-error';
          errorEl.textContent = 'Ingrese un email válido';
          field.parentNode.appendChild(errorEl);
        }
      }
    });
    
    return isValid;
  }

  /**
   * Escapa contenido HTML para prevenir XSS
   * @param {string} str - String a escapar
   * @returns {string} - String escapado
   */
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ═══════════════════════════════════════════
  // NAVEGACIÓN
  // ═══════════════════════════════════════════
  
  /**
   * Navega a una página/módulo específico
   * @param {string} page - Identificador de la página
   * @param {HTMLElement} el - Elemento de navegación clickeado
   */
  function navigate(page, el) {
    // Ocultar todos los módulos
    document.querySelectorAll('.module').forEach(m => m.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    
    // Mostrar módulo seleccionado
    const mod = document.getElementById('mod-' + page);
    if (mod) mod.classList.add('active');
    
    // Activar elemento de navegación
    if (el) el.classList.add('active');
    
    // Actualizar barra superior
    const info = CONFIG.pages[page] || { title: page, crumb: 'KnitSys / ' + page };
    document.getElementById('topbar-title').textContent = info.title;
    document.getElementById('topbar-breadcrumb').textContent = info.crumb;
    
    // Accesibilidad: enfocar el contenido principal
    if (mod) {
      mod.setAttribute('tabindex', '-1');
      mod.focus();
    }
  }

  // ═══════════════════════════════════════════
  // PESTAÑAS (TABS)
  // ═══════════════════════════════════════════
  
  /**
   * Cambia entre pestañas dentro de un módulo
   * @param {string} module - Identificador del módulo
   * @param {string} tab - Identificador de la pestaña
   * @param {HTMLElement} el - Elemento pestaña clickeado
   */
  function switchTab(module, tab, el) {
    const moduleEl = document.getElementById('mod-' + module);
    if (!moduleEl) return;
    
    moduleEl.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    moduleEl.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    
    el.classList.add('active');
    const tabContent = document.getElementById(module + '-tab-' + tab);
    if (tabContent) tabContent.classList.add('active');
  }

  // ═══════════════════════════════════════════
  // FILTRADO DE TABLAS
  // ═══════════════════════════════════════════
  
  /**
   * Filtra una tabla por término de búsqueda
   * @param {string} tableId - ID de la tabla
   * @param {string} q - Término de búsqueda
   */
  function filterTable(tableId, q) {
    const tbl = document.getElementById(tableId);
    if (!tbl) return;
    
    const rows = tbl.querySelectorAll('tbody tr');
    const term = q.toLowerCase().trim();
    
    rows.forEach(row => {
      row.style.display = term === '' || row.textContent.toLowerCase().includes(term) ? '' : 'none';
    });
  }

  // ═══════════════════════════════════════════
  // MODALES
  // ═══════════════════════════════════════════
  
  /**
   * Abre un modal
   * @param {string} id - ID del modal
   */
  function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    
    modal.classList.add('open');
    
    // Enfocar el primer input del modal
    setTimeout(() => {
      const firstInput = modal.querySelector('input:not([type="hidden"]), select, textarea');
      if (firstInput) firstInput.focus();
    }, 100);
    
    // Prevenir scroll del body
    document.body.style.overflow = 'hidden';
  }

  /**
   * Cierra un modal
   * @param {string} id - ID del modal
   */
  function closeModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    
    modal.classList.remove('open');
    
    // Restaurar scroll del body
    document.body.style.overflow = '';
    
    // Limpiar formulario si existe
    const form = modal.querySelector('form');
    if (form) {
      form.reset();
      form.querySelectorAll('.form-input.error').forEach(el => el.classList.remove('error'));
      form.querySelectorAll('.form-error').forEach(el => el.remove());
    }
  }

  /**
   * Maneja el envío de formularios en modales
   * @param {Event} e - Evento de submit
   * @param {string} modalId - ID del modal
   * @param {string} successMessage - Mensaje de éxito
   */
  function handleFormSubmit(e, modalId, successMessage) {
    e.preventDefault();
    
    const form = e.target;
    if (!validateForm(form)) {
      KnitSys.toast('Por favor complete los campos obligatorios', 'danger');
      return;
    }
    
    // Simular guardado (aquí iría la llamada al backend)
    closeModal(modalId);
    KnitSys.toast(successMessage, 'success');
  }

  // ═══════════════════════════════════════════
  // NOTIFICACIONES TOAST
  // ═══════════════════════════════════════════
  
  /**
   * Muestra una notificación toast
   * @param {string} msg - Mensaje a mostrar
   * @param {string} type - Tipo de toast ('success' o 'danger')
   */
  function toast(msg, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const toastEl = document.createElement('div');
    toastEl.className = `toast ${type}`;
    toastEl.setAttribute('role', 'alert');
    toastEl.setAttribute('aria-live', 'polite');
    toastEl.innerHTML = (type === 'success' ? '✓' : '✕') + ' ' + escapeHtml(msg);
    
    container.appendChild(toastEl);
    
    // Auto-eliminar después del tiempo configurado
    setTimeout(() => {
      toastEl.style.opacity = '0';
      toastEl.style.transition = 'opacity ' + CONFIG.animationDuration + 'ms';
      setTimeout(() => toastEl.remove(), CONFIG.animationDuration);
    }, CONFIG.toastDuration);
  }

  // ═══════════════════════════════════════════
  // RELOJ
  // ═══════════════════════════════════════════
  
  /**
   * Actualiza el reloj en la barra de estado
   */
  function updateClock() {
    const timeEl = document.getElementById('status-time');
    if (!timeEl) return;
    
    const now = new Date();
    timeEl.textContent = now.toLocaleTimeString('es-AR', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  }

  // ═══════════════════════════════════════════
  // SALIR
  // ═══════════════════════════════════════════
  
  /**
   * Maneja el cierre de sesión
   */
  function salir() {
    if (confirm('¿Cerrar sesión?')) {
      toast('Sesión cerrada. Hasta luego.', 'success');
      // Aquí iría la lógica real de logout
    }
  }

  // ═══════════════════════════════════════════
  // INICIALIZACIÓN
  // ═══════════════════════════════════════════
  
  function init() {
    // Iniciar reloj
    updateClock();
    setInterval(updateClock, 1000);
    
    // Configurar cierre de modales al hacer click en backdrop
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
      backdrop.addEventListener('click', function(e) {
        if (e.target === this) {
          closeModal(this.id);
        }
      });
    });
    
    // Configurar cierre de modales con tecla Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        const openModal = document.querySelector('.modal-backdrop.open');
        if (openModal) closeModal(openModal.id);
      }
    });
    
    // Configurar formularios de modales
    const formConfigs = [
      { modalId: 'modal-empresa', formSelector: '#modal-empresa .modal-body', successMsg: 'Empresa guardada correctamente' },
      { modalId: 'modal-contacto', formSelector: '#modal-contacto .modal-body', successMsg: 'Contacto guardado correctamente' },
      { modalId: 'modal-hilado', formSelector: '#modal-hilado .modal-body', successMsg: 'Hilado guardado correctamente' }
    ];
    
    formConfigs.forEach(config => {
      const modal = document.getElementById(config.modalId);
      if (!modal) return;
      
      const saveBtn = modal.querySelector('.btn-primary');
      if (saveBtn) {
        saveBtn.addEventListener('click', function(e) {
          const formBody = modal.querySelector(config.formSelector);
          if (formBody) {
            // Crear evento fake de submit
            const fakeEvent = {
              preventDefault: function() {},
              target: formBody
            };
            handleFormSubmit(fakeEvent, config.modalId, config.successMsg);
          }
        });
      }
    });
    
    // Configurar navegación por teclado en elementos interactivos
    document.querySelectorAll('.nav-item, .tab, .quick-card, .btn').forEach(el => {
      if (!el.hasAttribute('tabindex')) {
        el.setAttribute('tabindex', '0');
      }
      
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.click();
        }
      });
    });
    
    console.log('KnitSys v1.0.0 inicializado correctamente');
  }

  // ═══════════════════════════════════════════
  // API PÚBLICA
  // ═══════════════════════════════════════════
  
  // Exponer funciones necesarias globalmente para los handlers inline
  window.KnitSys = {
    navigate,
    switchTab,
    filterTable,
    openModal,
    closeModal,
    toast,
    salir,
    validateForm,
    escapeHtml
  };
  
  // También exponer con nombres directos para compatibilidad
  window.navigate = navigate;
  window.switchTab = switchTab;
  window.filterTable = filterTable;
  window.openModal = openModal;
  window.closeModal = closeModal;
  window.toast = toast;
  window.salir = salir;

  // Iniciar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();