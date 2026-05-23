import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { contactoService, empresaService, healthService } from '../services/api'
import { extractApiList } from '../utils/mapApi'

const DataContext = createContext(null)

const LIST_LIMIT = 500

export function DataProvider({ children }) {
  const [empresas, setEmpresas] = useState([])
  const [contactos, setContactos] = useState([])
  const [dbConnected, setDbConnected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const [empresasRes, contactosRes, healthRes] = await Promise.all([
        empresaService.getAll({ limit: LIST_LIMIT }),
        contactoService.getAll({ limit: LIST_LIMIT }),
        healthService.check().catch(() => ({ data: { database: 'disconnected' } })),
      ])

      const connected = healthRes.data?.database === 'connected'
      setEmpresas(extractApiList(empresasRes))
      setContactos(extractApiList(contactosRes))
      setDbConnected(connected)
      return { dbConnected: connected, error: null }
    } catch (err) {
      console.error('Error cargando datos KnitSys:', err)
      const message =
        'No se pudo conectar con el servidor. Verifica que el backend esté corriendo en el puerto 3000.'
      setError(message)
      setEmpresas([])
      setContactos([])
      setDbConnected(false)
      return { dbConnected: false, error: message }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const stats = useMemo(
    () => ({
      contactos: contactos.length,
      empresas: empresas.length,
    }),
    [contactos.length, empresas.length]
  )

  const value = useMemo(
    () => ({
      empresas,
      contactos,
      stats,
      dbConnected,
      loading,
      error,
      reload: load,
    }),
    [empresas, contactos, stats, dbConnected, loading, error, load]
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData debe usarse dentro de DataProvider')
  return ctx
}
