/**
 * Filtra filas por texto (equivalente a KnitSys.filterTable)
 */
export function filterRows(rows, query, textFn) {
  const term = query.toLowerCase().trim()
  if (!term) return rows
  return rows.filter((row) => {
    const text = textFn ? textFn(row) : JSON.stringify(row)
    return text.toLowerCase().includes(term)
  })
}
