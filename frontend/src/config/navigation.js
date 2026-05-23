/**
 * Configuración de navegación (equivalente a CONFIG.pages en js/app.js)
 */

export const PAGES = {
  home: { title: 'Inicio', crumb: 'KnitSys / Inicio' },
  contactos: { title: 'Contactos', crumb: 'KnitSys / Contactos' },
  hilados: { title: 'Hilados', crumb: 'KnitSys / Inventario / Hilados' },
  stock: { title: 'Stock', crumb: 'KnitSys / Inventario / Stock' },
  plan: { title: 'Plan de trabajo', crumb: 'KnitSys / Plan de trabajo' },
  desarrollos: { title: 'Desarrollos', crumb: 'KnitSys / Desarrollos' },
  config: { title: 'Configuración', crumb: 'KnitSys / Configuración' },
}

export const NAV_SECTIONS = [
  {
    label: 'Principal',
    items: [
      { id: 'home', label: 'Inicio', icon: '🏠' },
      { id: 'plan', label: 'Plan de trabajo', icon: '📋' },
      { id: 'desarrollos', label: 'Desarrollos', icon: '✏️' },
    ],
  },
  {
    label: 'Inventario',
    items: [
      { id: 'hilados', label: 'Hilados', icon: '🧵' },
      { id: 'stock', label: 'Stock', icon: '📦' },
    ],
  },
  {
    label: 'Gestión',
    items: [{ id: 'contactos', label: 'Contactos', icon: '👥' }],
  },
]

export const NAV_FOOTER = [
  { id: 'config', label: 'Configuración', icon: '⚙️' },
  { id: 'salir', label: 'Salir', icon: '⏻', danger: true, action: 'salir' },
]

export function getPageInfo(pageId) {
  return PAGES[pageId] || { title: pageId, crumb: `KnitSys / ${pageId}` }
}
