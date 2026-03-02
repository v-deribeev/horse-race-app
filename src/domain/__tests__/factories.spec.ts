import { describe, it, expect } from 'vitest'
import { generateHorses } from '../horse.factory'
import { createRaceSchedule } from '../race.factory'
import { ROUND_LENGTHS } from '../types'

describe('Domain Layer: Factories', () => {
  describe('horse.factory', () => {
    it('generates 20 horses', () => {
      const horses = generateHorses()
      expect(horses.length).toBe(20)
    })

    it('generates unique colors for all horses', () => {
      const horses = generateHorses()
      const colors = new Set(horses.map((h) => h.raceColor))
      expect(colors.size).toBe(20)
    })

    it('assigns condition scores between 1 and 100', () => {
      const horses = generateHorses()
      horses.forEach((horse) => {
        expect(horse.conditionScore).toBeGreaterThanOrEqual(1)
        expect(horse.conditionScore).toBeLessThanOrEqual(100)
      })
    })
  })

  describe('race.factory', () => {
    it('generates 6 rounds with specific lengths', () => {
      const horses = generateHorses()
      const schedule = createRaceSchedule(horses)

      expect(schedule.length).toBe(6)

      schedule.forEach((round, index) => {
        expect(round.roundNumber).toBe(index + 1)
        expect(round.length).toBe(ROUND_LENGTHS[index])
        expect(round.horses.length).toBe(10)
      })
    })
  })
})
