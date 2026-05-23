export default function Modal({ id, title, open, onClose, children, footer }) {
  if (!open) return null

  return (
    <div
      className="modal-backdrop"
      id={id}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby={`${id}-title`}>
        <div className="modal-header">
          <span className="modal-title" id={`${id}-title`}>
            {title}
          </span>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Cerrar">
            ✕
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  )
}
