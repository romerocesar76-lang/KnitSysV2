import { useMemo, useState } from 'react'
import { useAppUi } from '../context/AppUiContext'
import { MOCK_DESARROLLOS } from '../data/mockData'
import { filterRows } from '../utils/filterRows'

export default function Desarrollos() {
  const { toast } = useAppUi()
  const [search, setSearch] = useState('')
  const rows = useMemo(() => filterRows(MOCK_DESARROLLOS, search, rowToText), [search])

  return (
    <div className="module active" id="mod-desarrollos">
      <div className="card">
        <div className="search-bar">
          <div className="search-input-wrap">
            <span className="search-icon">🔍</span>
            <input
              className="search-input"
              placeholder="Buscar desarrollo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div style={{ flex: 1 }} />
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => toast('Nuevo desarrollo creado', 'success')}
          >
            + Nuevo desarrollo
          </button>
        </div>
        <div className="table-wrap">
          <table id="tbl-dev">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th>Responsable</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((d) => (
                <tr key={d.id}>
                  <td>
                    <strong>{d.nombre}</strong>
                  </td>
                  <td>{d.descripcion}</td>
                  <td>
                    <span className={`pill ${d.estado.pill}`}>{d.estado.label}</span>
                  </td>
                  <td>{d.responsable}</td>
                  <td>{d.fecha}</td>
                  <td>
                    <div className="flex-gap">
                      <button
                        type="button"
                        className="btn btn-edit btn-sm"
                        onClick={() => toast('Editando...', 'success')}
                      >
                        ✏️
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => toast('Eliminado', 'danger')}
                      >
                        🗑️
                      </button>
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

function rowToText(row) {
  return `${row.nombre} ${row.descripcion} ${row.estado.label} ${row.responsable}`
}
