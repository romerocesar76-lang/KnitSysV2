import { useEffect, useState } from 'react'
import { useAppUi } from '../context/AppUiContext'
import { tipoContactoService } from '../services/api'
import { getApiErrorMessage } from '../utils/apiErrors'
import Modal from './Modal'

const INITIAL_TIPO = {
  etiqueta: '',
  descripcion: '',
}

export default function TipoContactoModal({ open, onClose, onSave }) {
  const { toast } = useAppUi()
  const [tipos, setTipos] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(INITIAL_TIPO)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)

  // Cargar tipos de contacto
  useEffect(() => {
    if (!open) return
    loadTipos()
  }, [open])

  const loadTipos = async () => {
    setLoading(true)
    try {
      const res = await tipoContactoService.getAll()
      setTipos(res.data?.data || [])
    } catch (error) {
      toast(getApiErrorMessage(error), 'danger')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!form.etiqueta.trim()) {
      toast('La etiqueta es obligatoria', 'danger')
      return
    }

    setSaving(true)
    try {
      if (editingId) {
        // Actualizar
        await tipoContactoService.update(editingId, form)
        toast('Tipo de contacto actualizado', 'success')
      } else {
        // Crear
        await tipoContactoService.create(form)
        toast('Tipo de contacto creado', 'success')
      }
      setForm(INITIAL_TIPO)
      setEditingId(null)
      await loadTipos()
      if (onSave) onSave()
    } catch (error) {
      toast(getApiErrorMessage(error), 'danger')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (tipo) => {
    setForm(tipo)
    setEditingId(tipo.id)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este tipo de contacto?')) return

    try {
      await tipoContactoService.delete(id)
      toast('Tipo de contacto eliminado', 'success')
      await loadTipos()
    } catch (error) {
      toast(getApiErrorMessage(error), 'danger')
    }
  }

  const handleCancel = () => {
    setForm(INITIAL_TIPO)
    setEditingId(null)
  }

  return (
    <Modal
      id="modal-tipos-contacto"
      title="Administrar Tipos de Contacto"
      open={open}
      onClose={onClose}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Formulario */}
        <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500 }}>
              Etiqueta
            </label>
            <input
              type="text"
              className="input"
              placeholder="Ej: Cliente, Proveedor, Operario..."
              value={form.etiqueta}
              onChange={(e) => setForm({ ...form, etiqueta: e.target.value })}
              disabled={saving}
            />
          </div>

          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500 }}>
              Descripción (opcional)
            </label>
            <textarea
              className="input"
              placeholder="Descripción o notas..."
              value={form.descripcion || ''}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              disabled={saving}
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleSave}
              disabled={saving}
            >
              {editingId ? '💾 Actualizar' : '➕ Crear'}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleCancel}
                disabled={saving}
              >
                ✕ Cancelar
              </button>
            )}
          </div>
        </div>

        {/* Tabla */}
        <div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              Cargando tipos de contacto...
            </div>
          ) : tipos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              No hay tipos de contacto registrados
            </div>
          ) : (
            <div className="table-wrap" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Etiqueta</th>
                    <th>Descripción</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {tipos.map((tipo) => (
                    <tr key={tipo.id}>
                      <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                        {tipo.id}
                      </td>
                      <td>
                        <strong>{tipo.etiqueta}</strong>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.9em' }}>
                        {tipo.descripcion || '—'}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            type="button"
                            className="btn btn-edit btn-sm"
                            onClick={() => handleEdit(tipo)}
                            title="Editar"
                          >
                            ✏️
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(tipo.id)}
                            title="Eliminar"
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
          )}
        </div>
      </div>
    </Modal>
  )
}
