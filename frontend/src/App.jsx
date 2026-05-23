/**
 * KnitSys - Aplicación principal (React)
 */

import { useCallback, useState } from 'react'
import AppModals from './components/AppModals'
import Layout from './components/Layout'
import { useAppUi } from './context/AppUiContext'
import Config from './modules/Config'
import Contactos from './modules/Contactos'
import Desarrollos from './modules/Desarrollos'
import Hilados from './modules/Hilados'
import Home from './modules/Home'
import Plan from './modules/Plan'
import Stock from './modules/Stock'

function App() {
  const { toast } = useAppUi()
  const [activeModule, setActiveModule] = useState('home')

  const handleNavigate = useCallback(
    (pageId) => {
      if (pageId === 'salir') {
        if (window.confirm('¿Cerrar sesión?')) {
          toast('Sesión cerrada. Hasta luego.', 'success')
        }
        return
      }
      setActiveModule(pageId)
    },
    [toast]
  )

  const renderModule = () => {
    switch (activeModule) {
      case 'home':
        return <Home onNavigate={handleNavigate} />
      case 'contactos':
        return <Contactos />
      case 'hilados':
        return <Hilados />
      case 'stock':
        return <Stock />
      case 'plan':
        return <Plan />
      case 'desarrollos':
        return <Desarrollos />
      case 'config':
        return <Config />
      default:
        return <Home onNavigate={handleNavigate} />
    }
  }

  return (
    <>
      <Layout activeModule={activeModule} onNavigate={handleNavigate}>
        {renderModule()}
      </Layout>
      <AppModals />
    </>
  )
}

export default App
