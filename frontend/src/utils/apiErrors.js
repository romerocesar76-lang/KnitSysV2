export function getApiErrorMessage(error) {
  return error?.response?.data?.message || error?.message || 'Error de conexión con el servidor'
}
