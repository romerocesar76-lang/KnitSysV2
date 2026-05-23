import { useMemo, useState } from 'react'
import { useAppUi } from '../context/AppUiContext'
import { MOCK_HILADOS } from '../data/mockData'
import { filterRows } from '../utils/filterRows'

export default function Hilados() {
  const { toast, openModal } = useAppUi()
  const [search, setSearch] = useState('')
  const rows = useMemo(() => filterRows(MOCK_HILADOS, search, rowToText), [search])

  return (
    <div className="module active" id="mod-hilados">
      <div className="card">
        <div className="search-bar">
          <div className="search-input-wrap">
            <span className="search-icon">🔍</span>
            <input
              className="search-input"
              placeholder="Buscar hilado..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div style={{ flex: 1 }} />
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => openModal('modal-hilado')}
          >
            + Nuevo hilado
          </button>
        </div>
        <div className="table-wrap">
          <table id="tbl-hilados">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Tipo / Composición</th>
                <th>Color</th>
                <th>Stock (kg)</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((h) => (
                <tr key={h.id}>
                  <td>
                    <strong>{h.nombre}</strong>
                  </td>
                  <td>{h.tipo}</td>
                  <td>
                    <span className="pill pill-gray">{h.color}</span>
                  </td>
                  <td>{h.stock}</td>
                  <td>
                    <span className={`pill ${h.estado.pill}`}>{h.estado.label}</span>
                  </td>
                  <td>
                    <div className="flex-gap">
                      <button
                        type="button"
                        className="btn btn-edit btn-sm"
                        onClick={() => toast('Editando hilado...', 'success')}
                      >
                        ✏️ Editar
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => toast('Hilado eliminado', 'danger')}
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
  return `${row.nombre} ${row.tipo} ${row.color} ${row.estado.label}`
}
