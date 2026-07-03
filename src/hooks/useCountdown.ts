import { useEffect, useState } from 'react'

interface CountdownValues {
  days: number
  hours: number
  minutes: number
  seconds: number
  isComplete: boolean
}

function getCountdown(target: string): CountdownValues {
  const diff = new Date(target).getTime() - Date.now()

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isComplete: true }
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)

  return { days, hours, minutes, seconds, isComplete: false }
}

export function useCountdown(targetDate: string): CountdownValues {
  const [values, setValues] = useState(() => getCountdown(targetDate))

  useEffect(() => {
    const tick = () => setValues(getCountdown(targetDate))
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [targetDate])

  return values
}
