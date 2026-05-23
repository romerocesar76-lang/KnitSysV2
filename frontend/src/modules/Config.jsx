import { useAppUi } from '../context/AppUiContext'
import { useData } from '../context/DataContext'

export default function Config() {
  const { toast } = useAppUi()
  const { dbConnected, loading, reload } = useData()

  return (
    <div className="module active" id="mod-config">
      <div className="config-grid">
        <div className="config-section">
          <div className="config-section-header">
            <div className="config-section-title">👤 Mi cuenta</div>
          </div>
          <div className="config-item">
            <div>
              <div className="config-item-label">Nombre</div>
              <div className="config-item-value">M. Andrade</div>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => toast('Editando perfil...', 'success')}
            >
              Editar
            </button>
          </div>
          <div className="config-item">
            <div>
              <div className="config-item-label">Correo</div>
              <div className="config-item-value">andrade@knitsys.ar</div>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => toast('Editando...', 'success')}
            >
              Editar
            </button>
          </div>
          <div className="config-item">
            <div>
              <div className="config-item-label">Contraseña</div>
              <div className="config-item-value">••••••••</div>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => toast('Cambiando contraseña...', 'success')}
            >
              Cambiar
            </button>
          </div>
          <div className="config-item">
            <div>
              <div className="config-item-label">Rol</div>
              <div className="config-item-value">admin</div>
            </div>
            <span className="pill pill-blue">Admin</span>
          </div>
        </div>

        <div className="config-section">
          <div className="config-section-header">
            <div className="config-section-title">👥 Usuarios y roles</div>
          </div>
          <div className="config-item">
            <div>
              <div className="config-item-label">M. Andrade</div>
              <div className="config-item-value">admin</div>
            </div>
            <span className="pill pill-blue">Admin</span>
          </div>
          <div className="config-item">
            <div>
              <div className="config-item-label">L. Gómez</div>
              <div className="config-item-value">operator</div>
            </div>
            <span className="pill pill-gray">Operator</span>
          </div>
          <div className="config-item">
            <div>
              <div className="config-item-label">Marta P.</div>
              <div className="config-item-value">operator</div>
            </div>
            <span className="pill pill-gray">Operator</span>
          </div>
          <div className="config-item" style={{ justifyContent: 'center', padding: '10px 18px' }}>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => toast('Invitando usuario...', 'success')}
            >
              + Invitar usuario
            </button>
          </div>
        </div>

        <div className="config-section">
          <div className="config-section-header">
            <div className="config-section-title">⚙️ Parámetros generales</div>
          </div>
          <div className="config-item">
            <span className="config-item-label">País por defecto</span>
            <span className="config-item-value">🇦🇷 AR</span>
          </div>
          <div className="config-item">
            <span className="config-item-label">Moneda</span>
            <span className="config-item-value">ARS $</span>
          </div>
          <div className="config-item">
            <span className="config-item-label">Stock mínimo (kg)</span>
            <span className="config-item-value">10</span>
          </div>
          <div className="config-item">
            <span className="config-item-label">Zona horaria</span>
            <span className="config-item-value">America/Buenos_Aires</span>
          </div>
        </div>

        <div className="config-section">
          <div className="config-section-header">
            <div className="config-section-title">🔔 Preferencias</div>
          </div>
          <div className="config-item">
            <span className="config-item-label">Notificaciones de stock</span>
            <label className="toggle">
              <input type="checkbox" defaultChecked />
              <span className="toggle-slider" />
            </label>
          </div>
          <div className="config-item">
            <span className="config-item-label">Alertas de vencimiento</span>
            <label className="toggle">
              <input type="checkbox" defaultChecked />
              <span className="toggle-slider" />
            </label>
          </div>
          <div className="config-item">
            <span className="config-item-label">Modo oscuro</span>
            <label className="toggle">
              <input type="checkbox" />
              <span className="toggle-slider" />
            </label>
          </div>
          <div className="config-item">
            <span className="config-item-label">Mostrar auditoría</span>
            <label className="toggle">
              <input type="checkbox" />
              <span className="toggle-slider" />
            </label>
          </div>
        </div>

        <div className="config-section">
          <div className="config-section-header">
            <div className="config-section-title">🗄️ Base de datos</div>
          </div>
          <div className="config-item">
            <span className="config-item-label">Motor</span>
            <span className="config-item-value">MySQL 8.0 (local)</span>
          </div>
          <div className="config-item">
            <span className="config-item-label">Host</span>
            <span className="config-item-value">127.0.0.1:3306</span>
          </div>
          <div className="config-item">
            <span className="config-item-label">Estado</span>
            {loading ? (
              <span className="config-item-value">Verificando...</span>
            ) : (
              <span className={`pill ${dbConnected ? 'pill-green' : 'pill-red'}`}>
                {dbConnected ? 'Conectado' : 'Desconectado'}
              </span>
            )}
          </div>
          <div
            className="config-item"
            style={{ gap: 8, flexDirection: 'column', alignItems: 'flex-start' }}
          >
            <div className="flex-gap">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={async () => {
                  const result = await reload()
                  toast(
                    result?.dbConnected
                      ? 'Test de conexión OK ✓'
                      : 'No se pudo conectar a la base de datos',
                    result?.dbConnected ? 'success' : 'danger'
                  )
                }}
                disabled={loading}
              >
                Test conexión
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => toast('Backup generado', 'success')}
              >
                Backup
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
