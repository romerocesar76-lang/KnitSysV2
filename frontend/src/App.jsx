/**
 * KnitSys - Aplicación Principal React
 * Sistema de Gestión de Contactos Empresariales
 */

import { useState } from 'react'
import './App.css'

// ═══════════════════════════════════════════
// COMPONENTES DE LA APLICACIÓN
// ═══════════════════════════════════════════

function App() {
  const [activeModule, setActiveModule] = useState('home')
  const [activeTab, setActiveTab] = useState('all')

  // ═══ Navegación ═══
  const navItems = [
    { id: 'home', label: 'Inicio', icon: '🏠' },
    { id: 'empresas', label: 'Empresas', icon: '🏢' },
    { id: 'contactos', label: 'Contactos', icon: '👤' },
    { id: 'configuracion', label: 'Configuración', icon: '⚙️' },
  ]

  // ═══ Datos de ejemplo ═══
  const stats = {
    empresas: 42,
    contactos: 156,
    activos: 38,
    inactivos: 4,
  }

  const empresas = [
    { id: 1, nombre: 'TechCorp S.A.', ruc: '20123456789', estado: 'Activo', contactos: 8 },
    { id: 2, nombre: 'Innovatech Ltda.', ruc: '20987654321', estado: 'Activo', contactos: 5 },
    { id: 3, nombre: 'Global Services Inc.', ruc: '20555666777', estado: 'Inactivo', contactos: 2 },
  ]

  const contactos = [
    { id: 1, nombre: 'Juan Pérez', email: 'juan@techcorp.com', telefono: '+51 999 888 777', empresa: 'TechCorp S.A.', puesto: 'Gerente' },
    { id: 2, nombre: 'María García', email: 'maria@innovatech.com', telefono: '+51 888 777 666', empresa: 'Innovatech Ltda.', puesto: 'Directora' },
    { id: 3, nombre: 'Carlos López', email: 'carlos@techcorp.com', telefono: '+51 777 666 555', empresa: 'TechCorp S.A.', puesto: 'Analista' },
  ]

  // ═══ Renderizar módulo activo ═══
  const renderModule = () => {
    switch (activeModule) {
      case 'home':
        return <HomeModule stats={stats} setActiveModule={setActiveModule} />
      case 'empresas':
        return <EmpresasModule empresas={empresas} activeTab={activeTab} setActiveTab={setActiveTab} />
      case 'contactos':
        return <ContactosModule contactos={contactos} />
      case 'configuracion':
        return <ConfigModule />
      default:
        return <HomeModule stats={stats} setActiveModule={setActiveModule} />
    }
  }

  return (
    <div className="app">
      {/* ═══ SIDEBAR ═══ */}
      <aside id="sidebar">
        <div className="sidebar-logo">
          <div className="logo-mark">
            <div className="logo-icon">K</div>
            <div>
              <div className="logo-text">KnitSys</div>
              <div className="logo-sub">v2.0.0</div>
            </div>
          </div>
        </div>

        <div className="sidebar-section-label">Principal</div>
        <nav>
          {navItems.map(item => (
            <div
              key={item.id}
              className={`nav-item ${activeModule === item.id ? 'active' : ''}`}
              onClick={() => setActiveModule(item.id)}
              tabIndex={0}
              role="button"
              aria-label={`Ir a ${item.label}`}
              onKeyDown={(e) => e.key === 'Enter' && setActiveModule(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="avatar">CA</div>
          <div>
            <div className="sidebar-user-name">César Romero</div>
            <div className="sidebar-user-role">Administrador</div>
          </div>
        </div>
      </aside>

      {/* ═══ MAIN AREA ═══ */}
      <div id="main">
        {/* Top Bar */}
        <header id="topbar">
          <div>
            <div className="topbar-title">
              {activeModule === 'home' && 'Panel Principal'}
              {activeModule === 'empresas' && 'Gestión de Empresas'}
              {activeModule === 'contactos' && 'Gestión de Contactos'}
              {activeModule === 'configuracion' && 'Configuración del Sistema'}
            </div>
            <div className="topbar-breadcrumb">KnitSys / {activeModule}</div>
          </div>
          <div className="topbar-actions">
            <span className="topbar-badge">v2.0.0</span>
          </div>
        </header>

        {/* Content */}
        <main id="content">
          {renderModule()}
        </main>

        {/* Status Bar */}
        <footer id="statusbar">
          <div className="status-item">
            <span className="status-dot"></span>
            Conectado
          </div>
          <span className="status-sep"></span>
          <div className="status-item">TiDB Cloud</div>
          <span className="status-sep"></span>
          <div className="status-item">API v1.0</div>
          <span className="status-sep"></span>
          <div className="status-item">
            {new Date().toLocaleDateString('es-ES', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </footer>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════
// MÓDULO: HOME
// ═══════════════════════════════════════════

function HomeModule({ stats, setActiveModule }) {
  return (
    <div className="module active">
      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">🏢</div>
          <div className="stat-value">{stats.empresas}</div>
          <div className="stat-label">Empresas</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">👤</div>
          <div className="stat-value">{stats.contactos}</div>
          <div className="stat-label">Contactos</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">✅</div>
          <div className="stat-value">{stats.activos}</div>
          <div className="stat-label">Activos</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange">⏸️</div>
          <div className="stat-value">{stats.inactivos}</div>
          <div className="stat-label">Inactivos</div>
        </div>
      </div>

      {/* Quick Access */}
      <div className="section-title">Acceso Rápido</div>
      <div className="quick-access">
        <div className="quick-card" onClick={() => setActiveModule('empresas')} tabIndex={0} role="button">
          <div className="quick-card-icon">🏢</div>
          <div className="quick-card-label">Nueva Empresa</div>
        </div>
        <div className="quick-card" onClick={() => setActiveModule('contactos')} tabIndex={0} role="button">
          <div className="quick-card-icon">👤</div>
          <div className="quick-card-label">Nuevo Contacto</div>
        </div>
        <div className="quick-card" onClick={() => setActiveModule('empresas')} tabIndex={0} role="button">
          <div className="quick-card-icon">📊</div>
          <div className="quick-card-label">Reportes</div>
        </div>
        <div className="quick-card" onClick={() => setActiveModule('configuracion')} tabIndex={0} role="button">
          <div className="quick-card-icon">⚙️</div>
          <div className="quick-card-label">Ajustes</div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════
// MÓDULO: EMPRESAS
// ═══════════════════════════════════════════

function EmpresasModule({ empresas, activeTab, setActiveTab }) {
  return (
    <div className="module active">
      <div className="card">
        {/* Search Bar */}
        <div className="search-bar">
          <div className="search-input-wrap">
            <span className="search-icon">🔍</span>
            <input type="text" className="search-input" placeholder="Buscar empresa..." />
          </div>
          <button className="btn btn-primary">
            <span>+</span> Nueva Empresa
          </button>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <div className={`tab ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>
            Todas
          </div>
          <div className={`tab ${activeTab === 'activas' ? 'active' : ''}`} onClick={() => setActiveTab('activas')}>
            Activas
          </div>
          <div className={`tab ${activeTab === 'inactivas' ? 'active' : ''}`} onClick={() => setActiveTab('inactivas')}>
            Inactivas
          </div>
        </div>

        {/* Table */}
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Empresa</th>
                <th>RUC</th>
                <th>Estado</th>
                <th>Contactos</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {empresas.map(empresa => (
                <tr key={empresa.id}>
                  <td><strong>{empresa.nombre}</strong></td>
                  <td>{empresa.ruc}</td>
                  <td>
                    <span className={`pill ${empresa.estado === 'Activo' ? 'pill-green' : 'pill-gray'}`}>
                      {empresa.estado}
                    </span>
                  </td>
                  <td>{empresa.contactos}</td>
                  <td>
                    <div className="flex-gap">
                      <button className="btn btn-sm btn-edit">Editar</button>
                      <button className="btn btn-sm btn-danger">Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════
// MÓDULO: CONTACTOS
// ═══════════════════════════════════════════

function ContactosModule({ contactos }) {
  return (
    <div className="module active">
      <div className="card">
        {/* Search Bar */}
        <div className="search-bar">
          <div className="search-input-wrap">
            <span className="search-icon">🔍</span>
            <input type="text" className="search-input" placeholder="Buscar contacto..." />
          </div>
          <button className="btn btn-primary">
            <span>+</span> Nuevo Contacto
          </button>
        </div>

        {/* Table */}
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Empresa</th>
                <th>Puesto</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {contactos.map(contacto => (
                <tr key={contacto.id}>
                  <td><strong>{contacto.nombre}</strong></td>
                  <td>{contacto.email}</td>
                  <td>{contacto.telefono}</td>
                  <td>{contacto.empresa}</td>
                  <td>{contacto.puesto}</td>
                  <td>
                    <div className="flex-gap">
                      <button className="btn btn-sm btn-edit">Editar</button>
                      <button className="btn btn-sm btn-danger">Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════
// MÓDULO: CONFIGURACIÓN
// ═══════════════════════════════════════════

function ConfigModule() {
  return (
    <div className="module active">
      <div className="config-grid">
        <div className="config-section">
          <div className="config-section-header">
            <div className="config-section-title">Sistema</div>
          </div>
          <div className="config-item">
            <div className="config-item-label">Modo Mantenimiento</div>
            <label className="toggle">
              <input type="checkbox" />
              <span className="toggle-slider"></span>
            </label>
          </div>
          <div className="config-item">
            <div className="config-item-label">Notificaciones por Email</div>
            <label className="toggle">
              <input type="checkbox" defaultChecked />
              <span className="toggle-slider"></span>
            </label>
          </div>
          <div className="config-item">
            <div className="config-item-label">Backup Automático</div>
            <label className="toggle">
              <input type="checkbox" defaultChecked />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div className="config-section">
          <div className="config-section-header">
            <div className="config-section-title">Base de Datos</div>
          </div>
          <div className="config-item">
            <div className="config-item-label">Proveedor</div>
            <div className="config-item-value">TiDB Cloud</div>
          </div>
          <div className="config-item">
            <div className="config-item-label">Estado</div>
            <span className="pill pill-green">Conectado</span>
          </div>
          <div className="config-item">
            <div className="config-item-label">Región</div>
            <div className="config-item-value">us-east-1</div>
          </div>
        </div>

        <div className="config-section">
          <div className="config-section-header">
            <div className="config-section-title">Información</div>
          </div>
          <div className="config-item">
            <div className="config-item-label">Versión</div>
            <div className="config-item-value">2.0.0</div>
          </div>
          <div className="config-item">
            <div className="config-item-label">API</div>
            <div className="config-item-value">v1.0.0</div>
          </div>
          <div className="config-item">
            <div className="config-item-label">Entorno</div>
            <div className="config-item-value">Desarrollo</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App