import { useEffect, useState } from 'react'
import { useAppUi } from '../context/AppUiContext'
import { useData } from '../context/DataContext'
import { contactoService, empresaService } from '../services/api'
import { getApiErrorMessage } from '../utils/apiErrors'
import Modal from './Modal'

const INITIAL_EMPRESA = {
  nombre: '',
  cuit_rut_nif: '',
  condicion_fiscal: 'Responsable Inscripto',
  country_code: 'AR',
  actividad_economica: '',
  sitio_web: '',
}

const INITIAL_CONTACTO = {
  nombre: '',
  apellido: '',
  correo: '',
  telefono: '',
  resumen_notas: '',
  country_code: 'AR',
}

export default function AppModals() {
  const { openModalId, closeModal, toast } = useAppUi()
  const { reload } = useData()
  const [empresaForm, setEmpresaForm] = useState(INITIAL_EMPRESA)
  const [contactoForm, setContactoForm] = useState(INITIAL_CONTACTO)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (openModalId === 'modal-empresa') setEmpresaForm(INITIAL_EMPRESA)
    if (openModalId === 'modal-contacto') setContactoForm(INITIAL_CONTACTO)
  }, [openModalId])

  const handleSaveEmpresa = async () => {
    if (!empresaForm.nombre.trim()) {
      toast('El nombre de la empresa es obligatorio', 'danger')
      return
    }

    setSaving(true)
    try {
      await empresaService.create({
        nombre: empresaForm.nombre.trim(),
        cuit_rut_nif: empresaForm.cuit_rut_nif.trim() || undefined,
        condicion_fiscal: empresaForm.condicion_fiscal,
        actividad_economica: empresaForm.actividad_economica.trim() || undefined,
        sitio_web: empresaForm.sitio_web.trim() || undefined,
        country_code: empresaForm.country_code,
      })
      closeModal()
      toast('Empresa guardada correctamente', 'success')
      await reload({ silent: true })
    } catch (err) {
      toast(getApiErrorMessage(err), 'danger')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveContacto = async () => {
    if (!contactoForm.nombre.trim() && !contactoForm.apellido.trim()) {
      toast('El nombre o apellido del contacto es obligatorio', 'danger')
      return
    }

    setSaving(true)
    try {
      const res = await contactoService.create({
        nombre: contactoForm.nombre.trim() || undefined,
        apellido: contactoForm.apellido.trim() || undefined,
        resumen_notas: contactoForm.resumen_notas.trim() || undefined,
        country_code: contactoForm.country_code,
      })

      const contactoId = res.data?.data?.id
      if (contactoId) {
        if (contactoForm.correo.trim()) {
          await contactoService.addEmail(contactoId, {
            correo: contactoForm.correo.trim(),
            tipo: 'personal',
            es_principal: true,
          })
        }
        if (contactoForm.telefono.trim()) {
          await contactoService.addTelefono(contactoId, {
            telefono: contactoForm.telefono.trim(),
            country_code: contactoForm.country_code,
            tipo: 'movil',
            es_principal: true,
          })
        }
      }

      closeModal()
      toast('Contacto guardado correctamente', 'success')
      await reload({ silent: true })
    } catch (err) {
      toast(getApiErrorMessage(err), 'danger')
    } finally {
      setSaving(false)
    }
  }

  const saveHiladoMock = () => {
    closeModal()
    toast('Hilado guardado correctamente', 'success')
  }

  return (
    <>
      <Modal
        id="modal-empresa"
        title="Nueva empresa"
        open={openModalId === 'modal-empresa'}
        onClose={closeModal}
        footer={
          <>
            <button type="button" className="btn btn-secondary" onClick={closeModal} disabled={saving}>
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSaveEmpresa}
              disabled={saving}
            >
              {saving ? 'Guardando...' : 'Guardar empresa'}
            </button>
          </>
        }
      >
        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="empresa-nombre">
              Nombre *
            </label>
            <input
              id="empresa-nombre"
              className="form-input"
              placeholder="Nombre de la empresa"
              value={empresaForm.nombre}
              onChange={(e) => setEmpresaForm((f) => ({ ...f, nombre: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="empresa-cuit">
              CUIT / RUT / NIF
            </label>
            <input
              id="empresa-cuit"
              className="form-input"
              placeholder="20-12345678-9"
              value={empresaForm.cuit_rut_nif}
              onChange={(e) => setEmpresaForm((f) => ({ ...f, cuit_rut_nif: e.target.value }))}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="empresa-condicion">
              Condición fiscal
            </label>
            <select
              id="empresa-condicion"
              className="form-input"
              value={empresaForm.condicion_fiscal}
              onChange={(e) => setEmpresaForm((f) => ({ ...f, condicion_fiscal: e.target.value }))}
            >
              <option>Responsable Inscripto</option>
              <option>Monotributo</option>
              <option>Exento</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="empresa-pais">
              País
            </label>
            <select
              id="empresa-pais"
              className="form-input"
              value={empresaForm.country_code}
              onChange={(e) => setEmpresaForm((f) => ({ ...f, country_code: e.target.value }))}
            >
              <option value="AR">🇦🇷 Argentina</option>
              <option value="BR">🇧🇷 Brasil</option>
              <option value="UY">🇺🇾 Uruguay</option>
              <option value="GB">🇬🇧 Reino Unido</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="empresa-actividad">
            Actividad económica
          </label>
          <input
            id="empresa-actividad"
            className="form-input"
            placeholder="Ej: Fabricación de indumentaria"
            value={empresaForm.actividad_economica}
            onChange={(e) => setEmpresaForm((f) => ({ ...f, actividad_economica: e.target.value }))}
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="empresa-web">
            Sitio web
          </label>
          <input
            id="empresa-web"
            className="form-input"
            placeholder="https://..."
            value={empresaForm.sitio_web}
            onChange={(e) => setEmpresaForm((f) => ({ ...f, sitio_web: e.target.value }))}
          />
        </div>
      </Modal>

      <Modal
        id="modal-contacto"
        title="Nuevo contacto"
        open={openModalId === 'modal-contacto'}
        onClose={closeModal}
        footer={
          <>
            <button type="button" className="btn btn-secondary" onClick={closeModal} disabled={saving}>
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSaveContacto}
              disabled={saving}
            >
              {saving ? 'Guardando...' : 'Guardar contacto'}
            </button>
          </>
        }
      >
        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="contacto-nombre">
              Nombre *
            </label>
            <input
              id="contacto-nombre"
              className="form-input"
              placeholder="Nombre"
              value={contactoForm.nombre}
              onChange={(e) => setContactoForm((f) => ({ ...f, nombre: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="contacto-apellido">
              Apellido *
            </label>
            <input
              id="contacto-apellido"
              className="form-input"
              placeholder="Apellido"
              value={contactoForm.apellido}
              onChange={(e) => setContactoForm((f) => ({ ...f, apellido: e.target.value }))}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="contacto-correo">
              Correo
            </label>
            <input
              id="contacto-correo"
              className="form-input"
              type="email"
              placeholder="correo@ejemplo.com"
              value={contactoForm.correo}
              onChange={(e) => setContactoForm((f) => ({ ...f, correo: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="contacto-telefono">
              Teléfono
            </label>
            <input
              id="contacto-telefono"
              className="form-input"
              placeholder="+54 11 ..."
              value={contactoForm.telefono}
              onChange={(e) => setContactoForm((f) => ({ ...f, telefono: e.target.value }))}
            />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="contacto-notas">
            Notas
          </label>
          <input
            id="contacto-notas"
            className="form-input"
            placeholder="Observaciones..."
            value={contactoForm.resumen_notas}
            onChange={(e) => setContactoForm((f) => ({ ...f, resumen_notas: e.target.value }))}
          />
        </div>
      </Modal>

      <Modal
        id="modal-hilado"
        title="Nuevo hilado"
        open={openModalId === 'modal-hilado'}
        onClose={closeModal}
        footer={
          <>
            <button type="button" className="btn btn-secondary" onClick={closeModal}>
              Cancelar
            </button>
            <button type="button" className="btn btn-primary" onClick={saveHiladoMock}>
              Guardar hilado
            </button>
          </>
        }
      >
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Nombre *</label>
            <input className="form-input" placeholder="Ej: Merino 4/16" />
          </div>
          <div className="form-group">
            <label className="form-label">Tipo / Composición</label>
            <input className="form-input" placeholder="100% Lana merina" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Color</label>
            <input className="form-input" placeholder="Tostado, Negro..." />
          </div>
          <div className="form-group">
            <label className="form-label">Stock inicial (kg)</label>
            <input className="form-input" type="number" placeholder="0" min="0" />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Proveedor</label>
          <input className="form-input" placeholder="Buscar empresa proveedora..." />
        </div>
      </Modal>
    </>
  )
}
