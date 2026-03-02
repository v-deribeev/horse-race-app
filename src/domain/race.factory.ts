import { ROUND_LENGTHS, type Horse, type RaceRound } from './types'
import { pickRandom } from './random.utils'

export const createRaceSchedule = (availableHorses: Horse[]): RaceRound[] => {
  return ROUND_LENGTHS.map((length, index) => ({
    roundNumber: index + 1,
    length,
    horses: pickRandom(availableHorses, 10),
  }))
}
