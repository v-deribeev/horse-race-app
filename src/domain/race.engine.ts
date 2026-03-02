import type { RaceRound, RaceResult } from './types'

export const runRaceRound = (round: RaceRound): RaceResult => {
  // Pure simulation: Sort by condition score + a slight random variance factor
  const placements = [...round.horses].sort((a, b) => {
    const scoreA = a.conditionScore + (Math.random() * 20 - 10)
    const scoreB = b.conditionScore + (Math.random() * 20 - 10)
    return scoreB - scoreA // Highest score wins
  })

  return {
    roundNumber: round.roundNumber,
    length: round.length,
    placements,
  }
}
