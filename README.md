# Lyudmila's Anniversary

A small, modern single-page web app to celebrate Lyudmila's anniversary — a hero
banner, a live countdown to the party, a story timeline, and an interactive
guestbook where guests can leave wishes (persisted in the browser via
`localStorage`).

## Tech stack

- [Vite](https://vitejs.dev/) 5
- [React](https://react.dev/) 18 + TypeScript
- ESLint (flat config)

## Getting started

Requirements: Node.js 20+ and npm.

```bash
npm ci        # install dependencies from the lockfile (use `npm install` on first setup)
npm run dev   # start the dev server at http://localhost:5173
```

## Scripts

| Command         | Description                                   |
| --------------- | --------------------------------------------- |
| `npm run dev`     | Start the Vite dev server on port 5173.       |
| `npm run build`   | Type-check and build the production bundle.   |
| `npm run preview` | Preview the production build on port 4173.    |
| `npm run lint`    | Run ESLint over the project.                  |

## Project structure

```
index.html            # App entry HTML
src/
  main.tsx            # React bootstrap
  App.tsx             # Page composition
  config.ts           # Celebration details and story milestones
  index.css           # Global styles
  components/
    Hero.tsx
    Countdown.tsx
    Timeline.tsx
    Guestbook.tsx     # Interactive wishes (localStorage-backed)
```

## Cloud Agent environment

`.cursor/environment.json` configures the Cursor Cloud Agent environment: it runs
`npm ci` to install dependencies and launches the dev server (`npm run dev`) in a
persistent `dev-server` terminal on port 5173.
