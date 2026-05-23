import { useMemo, useState } from 'react'
import { useAppUi } from '../context/AppUiContext'
import { useData } from '../context/DataContext'
import { contactoService, empresaService } from '../services/api'
import { getApiErrorMessage } from '../utils/apiErrors'
import { mapContactoRow, mapEmpresaRow } from '../utils/mapApi'
import { filterRows } from '../utils/filterRows'

const mono = { fontFamily: 'var(--font-mono)' }

export default function Contactos() {
  const { toast, openModal } = useAppUi()
  const { empresas: empresasApi, contactos: contactosApi, loading, error, reload } = useData()

  const handleDeleteEmpresa = async (id, nombre) => {
    if (!window.confirm(`¿Eliminar la empresa "${nombre}"?`)) return
    try {
      await empresaService.delete(id)
      toast('Empresa eliminada', 'success')
      await reload({ silent: true })
    } catch (err) {
      toast(getApiErrorMessage(err), 'danger')
    }
  }

  const handleDeleteContacto = async (id, nombre, apellido) => {
    const label = [nombre, apellido].filter(Boolean).join(' ')
    if (!window.confirm(`¿Eliminar el contacto "${label}"?`)) return
    try {
      await contactoService.delete(id)
      toast('Contacto eliminado', 'danger')
      await reload({ silent: true })
    } catch (err) {
      toast(getApiErrorMessage(err), 'danger')
    }
  }
  const [activeTab, setActiveTab] = useState('empresas')
  const [searchEmpresas, setSearchEmpresas] = useState('')
  const [searchIndividuos, setSearchIndividuos] = useState('')

  const empresasRows = useMemo(
    () => empresasApi.map(mapEmpresaRow),
    [empresasApi]
  )
  const contactosRows = useMemo(
    () => contactosApi.map(mapContactoRow),
    [contactosApi]
  )

  const empresas = useMemo(
    () => filterRows(empresasRows, searchEmpresas, rowToText),
    [empresasRows, searchEmpresas]
  )
  const individuos = useMemo(
    () => filterRows(contactosRows, searchIndividuos, rowToText),
    [contactosRows, searchIndividuos]
  )

  return (
    <div className="module active" id="mod-contactos">
      {error && (
        <div className="card mb-16">
          <div className="card-body" style={{ color: 'var(--danger)' }}>
            ⚠️ {error}{' '}
            <button type="button" className="btn btn-secondary btn-sm" onClick={reload}>
              Reintentar
            </button>
          </div>
        </div>
      )}

      <div className="card">
        <div className="tabs" id="contactos-tabs">
          <div
            className={`tab${activeTab === 'empresas' ? ' active' : ''}`}
            onClick={() => setActiveTab('empresas')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setActiveTab('empresas')}
          >
            🏢 Empresas {loading ? '' : `(${empresasRows.length})`}
          </div>
          <div
            className={`tab${activeTab === 'individuos' ? ' active' : ''}`}
            onClick={() => setActiveTab('individuos')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setActiveTab('individuos')}
          >
            👤 Individuos {loading ? '' : `(${contactosRows.length})`}
          </div>
        </div>

        <div
          className={`tab-content${activeTab === 'empresas' ? ' active' : ''}`}
          id="contactos-tab-empresas"
        >
          <div className="search-bar" style={{ borderRadius: 0, background: 'var(--surface-2)' }}>
            <div className="search-input-wrap">
              <span className="search-icon">🔍</span>
              <input
                className="search-input"
                placeholder="Buscar empresa..."
                value={searchEmpresas}
                onChange={(e) => setSearchEmpresas(e.target.value)}
                disabled={loading}
              />
            </div>
            <div style={{ flex: 1 }} />
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => openModal('modal-empresa')}
            >
              + Nueva empresa
            </button>
          </div>
          <div className="table-wrap">
            <table id="tbl-empresas">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>CUIT / RUT / NIF</th>
                  <th>Condición fiscal</th>
                  <th>Actividad</th>
                  <th>País</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>
                      Cargando empresas...
                    </td>
                  </tr>
                ) : empresas.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>
                      No hay empresas registradas
                    </td>
                  </tr>
                ) : (
                  empresas.map((e) => (
                    <tr key={e.id}>
                      <td>
                        <strong>{e.nombre}</strong>
                      </td>
                      <td className="text-muted" style={mono}>
                        {e.cuit}
                      </td>
                      <td>
                        <span className={`pill ${e.condicion.pill}`}>{e.condicion.label}</span>
                      </td>
                      <td>{e.actividad}</td>
                      <td>{e.pais}</td>
                      <td>
                        <div className="flex-gap">
                          <button
                            type="button"
                            className="btn btn-edit btn-sm"
                            onClick={() => toast('Editando empresa...', 'success')}
                          >
                            ✏️ Editar
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteEmpresa(e.id, e.nombre)}
                          >
                            🗑️ Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div
          className={`tab-content${activeTab === 'individuos' ? ' active' : ''}`}
          id="contactos-tab-individuos"
        >
          <div className="search-bar" style={{ borderRadius: 0, background: 'var(--surface-2)' }}>
            <div className="search-input-wrap">
              <span className="search-icon">🔍</span>
              <input
                className="search-input"
                placeholder="Buscar contacto..."
                value={searchIndividuos}
                onChange={(e) => setSearchIndividuos(e.target.value)}
                disabled={loading}
              />
            </div>
            <div style={{ flex: 1 }} />
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => openModal('modal-contacto')}
            >
              + Nuevo contacto
            </button>
          </div>
          <div className="table-wrap">
            <table id="tbl-individuos">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Empresa principal</th>
                  <th>Tipo</th>
                  <th>Correo</th>
                  <th>Teléfono</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>
                      Cargando contactos...
                    </td>
                  </tr>
                ) : individuos.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>
                      No hay contactos registrados
                    </td>
                  </tr>
                ) : (
                  individuos.map((c) => (
                    <tr key={c.id}>
                      <td>{c.nombre}</td>
                      <td>{c.apellido}</td>
                      <td>{c.empresa}</td>
                      <td>
                        <span className={`pill ${c.tipo.pill}`}>{c.tipo.label}</span>
                      </td>
                      <td>{c.correo}</td>
                      <td>{c.telefono}</td>
                      <td>
                        <div className="flex-gap">
                          <button
                            type="button"
                            className="btn btn-edit btn-sm"
                            onClick={() => toast('Editando contacto...', 'success')}
                          >
                            ✏️ Editar
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteContacto(c.id, c.nombre, c.apellido)}
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

function rowToText(row) {
  return Object.values(row)
    .filter((v) => typeof v !== 'object' || v?.label)
    .map((v) => (typeof v === 'object' && v?.label ? v.label : String(v ?? '')))
    .join(' ')
}
