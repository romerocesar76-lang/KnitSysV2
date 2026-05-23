import { useEffect, useState } from 'react'

export function useStatusClock() {
  const [time, setTime] = useState(() => formatTime())

  useEffect(() => {
    const id = setInterval(() => setTime(formatTime()), 1000)
    return () => clearInterval(id)
  }, [])

  return time
}

function formatTime() {
  return new Date().toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}
