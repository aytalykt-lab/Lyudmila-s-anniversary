export const celebration = {
  honoree: 'Lyudmila',
  title: "Lyudmila's Anniversary",
  subtitle: 'A year of love, laughter, and cherished memories',
  // The upcoming celebration date. Update as needed.
  eventDate: '2026-10-10T18:00:00',
  location: 'The Rose Garden Hall',
} as const

export interface Milestone {
  year: string
  title: string
  description: string
}

export const milestones: Milestone[] = [
  {
    year: 'The Beginning',
    title: 'Where it all started',
    description:
      'A chance meeting turned into a lifetime of shared adventures and quiet mornings.',
  },
  {
    year: 'Growing Together',
    title: 'Building a home',
    description:
      'From tiny apartments to a home filled with warmth, plants, and endless coffee.',
  },
  {
    year: 'Adventures',
    title: 'Seeing the world',
    description:
      'Mountains climbed, oceans crossed, and countless sunsets watched hand in hand.',
  },
  {
    year: 'Today',
    title: 'Celebrating you',
    description:
      'Another year to be grateful for the love and light you bring to everyone around you.',
  },
]
