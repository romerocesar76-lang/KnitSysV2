import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../../css/styles.css'
import './app-layout.css'
import App from './App.jsx'
import { AppUiProvider } from './context/AppUiContext'
import { DataProvider } from './context/DataContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppUiProvider>
      <DataProvider>
        <App />
      </DataProvider>
    </AppUiProvider>
  </StrictMode>,
)
