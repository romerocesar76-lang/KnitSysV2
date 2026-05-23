import { useMemo, useState } from 'react'
import { useAppUi } from '../context/AppUiContext'
import { MOCK_STOCK } from '../data/mockData'

const mono = { fontFamily: 'var(--font-mono)' }

export default function Stock() {
  const { toast } = useAppUi()
  const [search, setSearch] = useState('')
  const [talle, setTalle] = useState('')
  const [color, setColor] = useState('')

  const rows = useMemo(() => {
    const term = search.toLowerCase().trim()
    return MOCK_STOCK.filter((row) => {
      const text = `${row.codigo} ${row.nombre} ${row.talle} ${row.color} ${row.estado.label}`.toLowerCase()
      if (term && !text.includes(term)) return false
      if (talle && row.talle !== talle) return false
      if (color && row.color !== color) return false
      return true
    })
  }, [search, talle, color])

  return (
    <div className="module active" id="mod-stock">
      <div className="card">
        <div className="search-bar">
          <div className="search-input-wrap">
            <span className="search-icon">🔍</span>
            <input
              className="search-input"
              placeholder="Buscar producto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div
            className="filter-bar"
            style={{ padding: 0, border: 'none', background: 'none', marginLeft: 8 }}
          >
            <select className="filter-select" value={talle} onChange={(e) => setTalle(e.target.value)}>
              <option value="">Todos los talles</option>
              {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <select className="filter-select" value={color} onChange={(e) => setColor(e.target.value)}>
              <option value="">Todos los colores</option>
              {['Negro', 'Crudo', 'Azul marino', 'Burdeos', 'Tostado'].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div style={{ flex: 1 }} />
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => toast('Función próximamente', 'success')}
          >
            + Nuevo producto
          </button>
        </div>
        <div className="table-wrap">
          <table id="tbl-stock">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Talle</th>
                <th>Color</th>
                <th>Cantidad</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id}>
                  <td className="text-muted" style={mono}>
                    {p.codigo}
                  </td>
                  <td>{p.nombre}</td>
                  <td>{p.talle}</td>
                  <td>{p.color}</td>
                  <td>{p.cantidad}</td>
                  <td>
                    <span className={`pill ${p.estado.pill}`}>{p.estado.label}</span>
                  </td>
                  <td>
                    <div className="flex-gap">
                      <button
                        type="button"
                        className="btn btn-edit btn-sm"
                        onClick={() => toast('Editando producto...', 'success')}
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
