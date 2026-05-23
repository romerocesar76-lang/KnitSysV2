import { createContext, useCallback, useContext, useEffect, useState } from 'react'

const TOAST_DURATION = 2800
const TOAST_FADE = 300

const AppUiContext = createContext(null)

export function AppUiProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const [openModalId, setOpenModalId] = useState(null)

  const toast = useCallback((msg, type = 'success') => {
    const id = crypto.randomUUID()
    setToasts((prev) => [...prev, { id, msg, type, fading: false }])

    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, fading: true } : t))
      )
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, TOAST_FADE)
    }, TOAST_DURATION)
  }, [])

  const openModal = useCallback((id) => setOpenModalId(id), [])
  const closeModal = useCallback(() => setOpenModalId(null), [])

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && openModalId) closeModal()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [openModalId, closeModal])

  return (
    <AppUiContext.Provider value={{ toast, openModal, closeModal, openModalId }}>
      {children}
      <div id="toast-container">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`toast ${t.type}`}
            role="alert"
            aria-live="polite"
            style={{
              opacity: t.fading ? 0 : 1,
              transition: `opacity ${TOAST_FADE}ms`,
            }}
          >
            {(t.type === 'success' ? '✓' : '✕') + ' ' + t.msg}
          </div>
        ))}
      </div>
    </AppUiContext.Provider>
  )
}

export function useAppUi() {
  const ctx = useContext(AppUiContext)
  if (!ctx) throw new Error('useAppUi debe usarse dentro de AppUiProvider')
  return ctx
}
