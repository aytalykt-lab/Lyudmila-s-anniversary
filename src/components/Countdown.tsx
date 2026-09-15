import { useEffect, useMemo, useState } from 'react'
import { celebration } from '../config'

interface TimeParts {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function getRemaining(target: number): TimeParts {
  const diff = Math.max(0, target - Date.now())
  const seconds = Math.floor(diff / 1000)
  return {
    days: Math.floor(seconds / 86400),
    hours: Math.floor((seconds % 86400) / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60,
  }
}

export default function Countdown() {
  const target = useMemo(
    () => new Date(celebration.eventDate).getTime(),
    [],
  )
  const [remaining, setRemaining] = useState<TimeParts>(() =>
    getRemaining(target),
  )

  useEffect(() => {
    const id = setInterval(() => setRemaining(getRemaining(target)), 1000)
    return () => clearInterval(id)
  }, [target])

  const isPast = target - Date.now() <= 0
  const units: Array<[string, number]> = [
    ['Days', remaining.days],
    ['Hours', remaining.hours],
    ['Minutes', remaining.minutes],
    ['Seconds', remaining.seconds],
  ]

  return (
    <section className="section countdown" aria-labelledby="countdown-heading">
      <h2 id="countdown-heading" className="section__title">
        {isPast ? 'The celebration has begun!' : 'Counting down to the party'}
      </h2>
      <p className="section__lead">
        Join us at {celebration.location} for an evening to remember.
      </p>
      <div className="countdown__grid" role="timer" aria-live="polite">
        {units.map(([label, value]) => (
          <div className="countdown__cell" key={label}>
            <span className="countdown__value">
              {String(value).padStart(2, '0')}
            </span>
            <span className="countdown__label">{label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
