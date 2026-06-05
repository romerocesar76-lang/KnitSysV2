/** Extrae el array `data` de una respuesta API KnitSys */
export function extractApiList(response) {
  return response?.data?.data ?? []
}

const CONDICION_PILLS = {
  'responsable inscripto': 'pill-green',
  monotributo: 'pill-blue',
  exento: 'pill-gray',
}

const TIPO_PILLS = {
  cliente: 'pill-green',
  proveedora: 'pill-blue',
  proveedor: 'pill-blue',
  operaria: 'pill-orange',
  operario: 'pill-orange',
}

const COUNTRY_FLAGS = {
  AR: '🇦🇷',
  BR: '🇧🇷',
  UY: '🇺🇾',
  GB: '🇬🇧',
  US: '🇺🇸',
}

export function formatCountry(code) {
  if (!code) return '—'
  const upper = String(code).toUpperCase()
  const flag = COUNTRY_FLAGS[upper] || ''
  return `${flag} ${upper}`.trim()
}

export function condicionToPill(condicion) {
  const key = (condicion || '').toLowerCase().trim()
  const pill = CONDICION_PILLS[key] || 'pill-gray'
  return {
    label: condicion || '—',
    pill,
  }
}

export function tipoToPill(etiqueta) {
  const key = (etiqueta || '').toLowerCase().trim()
  const pill = TIPO_PILLS[key] || 'pill-gray'
  return {
    label: etiqueta || '—',
    pill,
  }
}

/** Mapea empresa API → fila UI (tabla Contactos) */
export function mapEmpresaRow(e) {
  return {
    id: e.id,
    nombre: e.nombre || '—',
    actividad: e.actividad_economica || '—',
    tipo: tipoToPill(e.tipo_contacto),
    creado_en: e.creado_en || '—',
    _raw: e,
  }
}

/** Mapea contacto API → fila UI (tabla Individuos) */
export function mapContactoRow(c) {
  return {
    id: c.id,
    nombre: c.nombre || '—',
    apellido: c.apellido || '—',
    empresa: c.empresa_principal || '—',
    tipo: tipoToPill(c.tipo_contacto_etiqueta),
    creado_en: c.creado_en || '—',
    correo: c.email_principal || '—',
    telefono: c.telefono_principal || '—',
    _raw: c,
  }
}
