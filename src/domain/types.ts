export type Horse = {
  id: string
  name: string
  raceColor: string
  conditionScore: number
}

export const ROUND_LENGTHS = [1200, 1400, 1600, 1800, 2000, 2200] as const
export type RoundLength = (typeof ROUND_LENGTHS)[number]

export type RaceRound = {
  roundNumber: number
  length: RoundLength
  horses: Horse[]
}

export type RaceResult = {
  roundNumber: number
  length: RoundLength
  placements: Horse[]
}

export type RaceState = 'idle' | 'ready' | 'running' | 'finished'
