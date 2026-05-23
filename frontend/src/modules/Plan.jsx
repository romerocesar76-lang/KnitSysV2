import { useMemo, useState } from 'react'
import { useAppUi } from '../context/AppUiContext'
import { MOCK_PLAN } from '../data/mockData'
import { filterRows } from '../utils/filterRows'

const mono = { fontFamily: 'var(--font-mono)' }

export default function Plan() {
  const { toast } = useAppUi()
  const [search, setSearch] = useState('')
  const rows = useMemo(() => filterRows(MOCK_PLAN, search, rowToText), [search])

  return (
    <div className="module active" id="mod-plan">
      <div className="card">
        <div className="search-bar">
          <div className="search-input-wrap">
            <span className="search-icon">🔍</span>
            <input
              className="search-input"
              placeholder="Buscar orden..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div style={{ flex: 1 }} />
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => toast('Nueva orden creada', 'success')}
          >
            + Nueva orden
          </button>
        </div>
        <div className="table-wrap">
          <table id="tbl-plan">
            <thead>
              <tr>
                <th>Orden</th>
                <th>Producto</th>
                <th>Estado</th>
                <th>Fecha inicio</th>
                <th>Fecha fin</th>
                <th>Responsable</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((o) => (
                <tr key={o.id}>
                  <td className="text-muted" style={mono}>
                    {o.orden}
                  </td>
                  <td>{o.producto}</td>
                  <td>
                    <span className={`pill ${o.estado.pill}`}>{o.estado.label}</span>
                  </td>
                  <td>{o.inicio}</td>
                  <td>{o.fin}</td>
                  <td>{o.responsable}</td>
                  <td>
                    <div className="flex-gap">
                      <button
                        type="button"
                        className="btn btn-edit btn-sm"
                        onClick={() => toast('Editando orden...', 'success')}
                      >
                        ✏️
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
  return `${row.orden} ${row.producto} ${row.estado.label} ${row.responsable}`
}
