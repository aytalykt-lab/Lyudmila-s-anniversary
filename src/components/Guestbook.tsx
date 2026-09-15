import { useEffect, useState, type FormEvent } from 'react'

interface Wish {
  id: string
  name: string
  message: string
  createdAt: number
}

const STORAGE_KEY = 'lyudmila-anniversary-wishes'

const seedWishes: Wish[] = [
  {
    id: 'seed-1',
    name: 'The Petrov Family',
    message: 'Wishing you another year full of joy and beautiful memories!',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
  },
]

function loadWishes(): Wish[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return seedWishes
    const parsed = JSON.parse(raw) as Wish[]
    return Array.isArray(parsed) ? parsed : seedWishes
  } catch {
    return seedWishes
  }
}

export default function Guestbook() {
  const [wishes, setWishes] = useState<Wish[]>(loadWishes)
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishes))
    } catch {
      // Ignore storage failures (e.g. private mode); wishes stay in memory.
    }
  }, [wishes])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedName = name.trim()
    const trimmedMessage = message.trim()
    if (!trimmedName || !trimmedMessage) return

    const wish: Wish = {
      id:
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : String(Date.now()),
      name: trimmedName,
      message: trimmedMessage,
      createdAt: Date.now(),
    }
    setWishes((current) => [wish, ...current])
    setName('')
    setMessage('')
  }

  return (
    <section className="section guestbook" id="guestbook" aria-labelledby="guestbook-heading">
      <h2 id="guestbook-heading" className="section__title">
        Guestbook
      </h2>
      <p className="section__lead">
        Share a memory or a wish for Lyudmila — it will appear below instantly.
      </p>

      <form className="guestbook__form" onSubmit={handleSubmit}>
        <label className="field">
          <span className="field__label">Your name</span>
          <input
            className="field__input"
            type="text"
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Anna"
            required
          />
        </label>
        <label className="field">
          <span className="field__label">Your wish</span>
          <textarea
            className="field__input field__input--area"
            name="message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Write something heartfelt..."
            rows={3}
            required
          />
        </label>
        <button className="guestbook__submit" type="submit">
          Add my wish
        </button>
      </form>

      <ul className="guestbook__list" aria-live="polite">
        {wishes.map((wish) => (
          <li className="wish" key={wish.id}>
            <p className="wish__message">“{wish.message}”</p>
            <p className="wish__author">— {wish.name}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
