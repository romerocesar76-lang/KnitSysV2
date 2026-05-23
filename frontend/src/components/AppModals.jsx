import { useAppUi } from '../context/AppUiContext'
import Modal from './Modal'

export default function AppModals() {
  const { openModalId, closeModal, toast } = useAppUi()

  const save = (message) => {
    closeModal()
    toast(message, 'success')
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
            <button type="button" className="btn btn-secondary" onClick={closeModal}>
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => save('Empresa guardada correctamente')}
            >
              Guardar empresa
            </button>
          </>
        }
      >
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Nombre *</label>
            <input className="form-input" placeholder="Nombre de la empresa" />
          </div>
          <div className="form-group">
            <label className="form-label">CUIT / RUT / NIF *</label>
            <input className="form-input" placeholder="20-12345678-9" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Condición fiscal</label>
            <select className="form-input" defaultValue="Responsable Inscripto">
              <option>Responsable Inscripto</option>
              <option>Monotributo</option>
              <option>Exento</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">País</label>
            <select className="form-input" defaultValue="🇦🇷 Argentina">
              <option>🇦🇷 Argentina</option>
              <option>🇧🇷 Brasil</option>
              <option>🇺🇾 Uruguay</option>
              <option>🇬🇧 Reino Unido</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Actividad económica</label>
          <input className="form-input" placeholder="Ej: Fabricación de indumentaria" />
        </div>
        <div className="form-group">
          <label className="form-label">Sitio web</label>
          <input className="form-input" placeholder="https://..." />
        </div>
      </Modal>

      <Modal
        id="modal-contacto"
        title="Nuevo contacto"
        open={openModalId === 'modal-contacto'}
        onClose={closeModal}
        footer={
          <>
            <button type="button" className="btn btn-secondary" onClick={closeModal}>
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => save('Contacto guardado correctamente')}
            >
              Guardar contacto
            </button>
          </>
        }
      >
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Nombre *</label>
            <input className="form-input" placeholder="Nombre" />
          </div>
          <div className="form-group">
            <label className="form-label">Apellido *</label>
            <input className="form-input" placeholder="Apellido" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Correo</label>
            <input className="form-input" type="email" placeholder="correo@ejemplo.com" />
          </div>
          <div className="form-group">
            <label className="form-label">Teléfono</label>
            <input className="form-input" placeholder="+54 11 ..." />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Tipo de contacto</label>
            <select className="form-input" defaultValue="Cliente">
              <option>Cliente</option>
              <option>Proveedora</option>
              <option>Operaria</option>
              <option>Otro</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Empresa principal</label>
            <input className="form-input" placeholder="Buscar empresa..." />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Notas</label>
          <input className="form-input" placeholder="Observaciones..." />
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
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => save('Hilado guardado correctamente')}
            >
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
