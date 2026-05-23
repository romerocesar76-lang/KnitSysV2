import { useData } from '../context/DataContext'

const QUICK_ACCESS = [
  { id: 'contactos', icon: '👥', label: 'Contactos' },
  { id: 'plan', icon: '📋', label: 'Plan de trabajo' },
  { id: 'hilados', icon: '🧵', label: 'Hilados' },
  { id: 'stock', icon: '📦', label: 'Stock' },
  { id: 'desarrollos', icon: '✏️', label: 'Desarrollos' },
  { id: 'config', icon: '⚙️', label: 'Configuración' },
]

const RECENT_ACTIVITY = [
  {
    event: 'Nuevo contacto: Textiles SA',
    module: 'Contactos',
    pill: 'pill-blue',
    user: 'M. Andrade',
    time: 'Hoy 10:42',
  },
  {
    event: 'Stock actualizado — Buzo T.M',
    module: 'Stock',
    pill: 'pill-green',
    user: 'L. Gómez',
    time: 'Hoy 09:15',
  },
  {
    event: 'Orden #0024 iniciada',
    module: 'Plan',
    pill: 'pill-orange',
    user: 'M. Andrade',
    time: 'Hoy 08:30',
  },
  {
    event: 'Ingreso hilado Merino 4/16',
    module: 'Hilados',
    pill: 'pill-gray',
    user: 'L. Gómez',
    time: 'Ayer 17:55',
  },
]

function formatStat(value, loading) {
  if (loading) return '…'
  return value
}

export default function Home({ onNavigate }) {
  const { stats, loading, empresas } = useData()

  return (
    <div className="module active" id="mod-home">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">👥</div>
          <div className="stat-value">{formatStat(stats.contactos, loading)}</div>
          <div className="stat-label">Contactos</div>
          {!loading && stats.contactos > 0 && (
            <div className="stat-change">Desde la base de datos</div>
          )}
        </div>
        <div className="stat-card">
          <div className="stat-icon green">📦</div>
          <div className="stat-value">1.240</div>
          <div className="stat-label">Unidades en stock</div>
          <div className="stat-change text-muted">Próximamente API</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange">🧵</div>
          <div className="stat-value">18</div>
          <div className="stat-label">Tipos de hilado</div>
          <div className="stat-change text-muted">Próximamente API</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red">📋</div>
          <div className="stat-value">6</div>
          <div className="stat-label">Órdenes activas</div>
          <div className="stat-change" style={{ color: 'var(--warning)' }}>
            Próximamente API
          </div>
        </div>
      </div>

      {!loading && empresas.length > 0 && (
        <p className="text-muted mb-16" style={{ fontSize: 12 }}>
          {stats.empresas} {stats.empresas === 1 ? 'empresa registrada' : 'empresas registradas'} en el
          sistema.
        </p>
      )}

      <p className="section-title">Accesos rápidos</p>
      <div className="quick-access">
        {QUICK_ACCESS.map((item) => (
          <div
            key={item.id}
            className="quick-card"
            onClick={() => onNavigate(item.id)}
            onKeyDown={(e) => e.key === 'Enter' && onNavigate(item.id)}
            tabIndex={0}
            role="button"
          >
            <div className="quick-card-icon">{item.icon}</div>
            <div className="quick-card-label">{item.label}</div>
          </div>
        ))}
      </div>

      <div className="card mt-16">
        <div className="card-header">
          <span className="card-title">Actividad reciente</span>
          <span className="text-muted">Últimas 24 hs</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Evento</th>
                <th>Módulo</th>
                <th>Usuario</th>
                <th>Fecha/Hora</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_ACTIVITY.map((row) => (
                <tr key={row.event}>
                  <td>{row.event}</td>
                  <td>
                    <span className={`pill ${row.pill}`}>{row.module}</span>
                  </td>
                  <td>{row.user}</td>
                  <td>{row.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
