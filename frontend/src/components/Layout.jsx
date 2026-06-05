import { NAV_FOOTER, NAV_SECTIONS, getPageInfo } from '../config/navigation'
import { useData } from '../context/DataContext'
import { useStatusClock } from '../hooks/useStatusClock'

function NavItem({ item, active, onNavigate }) {
  const isSalir = item.action === 'salir'

  return (
    <div
      className={`nav-item${item.danger ? ' nav-danger' : ''}${active ? ' active' : ''}`}
      onClick={() => (isSalir ? onNavigate('salir') : onNavigate(item.id))}
      onKeyDown={(e) => {
        if (e.key === 'Enter') isSalir ? onNavigate('salir') : onNavigate(item.id)
      }}
      tabIndex={0}
      role="button"
      aria-label={item.label}
      aria-current={active ? 'page' : undefined}
    >
      <span className="nav-icon">{item.icon}</span> {item.label}
    </div>
  )
}

export default function Layout({ activeModule, onNavigate, children }) {
  const statusTime = useStatusClock()
  const { dbConnected, loading: dataLoading } = useData()
  const page = getPageInfo(activeModule)

  const dbLabel =
    dataLoading && dbConnected === null
      ? 'Verificando BD...'
      : dbConnected
        ? 'MySQL conectado'
        : 'BD desconectada'

  const isActive = (id) => activeModule === id

  return (
    <div className="app">
      <aside id="sidebar">
        <div className="sidebar-logo">
          <div className="logo-mark">
            <div className="logo-icon"><img src="/logo.png" alt="KnitSys Logo" className="h-full" /></div>
            <div>
              <div className="logo-text">KnitSysV2</div>
              <div className="logo-sub">Gestión de producción</div>
            </div>
          </div>
        </div>

        <nav>
          {NAV_SECTIONS.map((section) => (
            <div key={section.label}>
              <div className="sidebar-section-label">{section.label}</div>
              {section.items.map((item) => (
                <NavItem
                  key={item.id}
                  item={item}
                  active={isActive(item.id)}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          ))}

          <hr className="nav-divider" />

          {NAV_FOOTER.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              active={!item.action && isActive(item.id)}
              onNavigate={onNavigate}
            />
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="avatar">MA</div>
          <div>
            <div className="sidebar-user-name">M. Andrade</div>
            <div className="sidebar-user-role">Admin</div>
          </div>
        </div>
      </aside>

      <div id="main">
        <header id="topbar">
          <div>
            <div className="topbar-title" id="topbar-title">
              {page.title}
            </div>
            <div className="topbar-breadcrumb" id="topbar-breadcrumb">
              {page.crumb}
            </div>
          </div>
          <div className="topbar-actions">
            <span className="topbar-badge">
              {dbConnected === false ? '🔴 Sin conexión API' : '🟢 Conectado'}
            </span>
          </div>
        </header>

        <div id="content">{children}</div>

        <footer id="statusbar">
          <div className="status-item">
            <div className={`status-dot${dbConnected === false ? ' warning' : ''}`}></div> {dbLabel}
          </div>
          <div className="status-sep"></div>
          <div className="status-item">Usuario: M. Andrade (admin)</div>
          <div className="status-sep"></div>
          <div className="status-item" id="status-time">
            {statusTime}
          </div>
          <div className="status-sep"></div>
          <div className="status-item">v1.0.0</div>
        </footer>
      </div>
    </div>
  )
}
