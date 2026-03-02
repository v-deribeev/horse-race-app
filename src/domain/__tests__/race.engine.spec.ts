import { describe, it, expect, vi, afterEach } from 'vitest'
import { runRaceRound } from '../race.engine'
import type { RaceRound, Horse } from '../types'

describe('Domain Layer: Race Engine', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns a complete race result with 10 unique placements', () => {
    const mockHorses: Horse[] = Array.from({ length: 10 }).map((_, i) => ({
      id: `h${i}`,
      name: `Horse-${i}`,
      conditionScore: 50,
      raceColor: '#000',
    }))

    const mockRound: RaceRound = { roundNumber: 1, length: 1200, horses: mockHorses }
    const result = runRaceRound(mockRound)

    expect(result.roundNumber).toBe(1)
    expect(result.length).toBe(1200)
    expect(result.placements.length).toBe(10)

    // Ensure no duplicates / ties
    const uniqueIds = new Set(result.placements.map((h) => h.id))
    expect(uniqueIds.size).toBe(10)
  })

  it('sorts horses correctly based on performance when randomness is neutralized', () => {
    // STUB: Remove all random luck from the race equation
    vi.spyOn(Math, 'random').mockReturnValue(0.5)

    // Create 3 horses with distinctly different conditions
    const mockHorses: Horse[] = [
      { id: 'h1', name: 'Slow', conditionScore: 10, raceColor: '#000' },
      { id: 'h2', name: 'Fast', conditionScore: 99, raceColor: '#000' },
      { id: 'h3', name: 'Mid', conditionScore: 50, raceColor: '#000' },
    ]

    const result = runRaceRound({ roundNumber: 1, length: 1200, horses: mockHorses })

    // Because we stubbed the randomness, the horse with the highest condition MUST win
    const finishingOrder = result.placements.map((horse) => horse.id)

    // Assert the exact expected order in one clean line
    expect(finishingOrder).toEqual(['h2', 'h3', 'h1'])

    // // Checks that the first 3 items in the array match these specific IDs in this exact order
    // expect(result.placements).toMatchObject([
    //   { id: 'h2' }, // 1st place
    //   { id: 'h3' }, // 2nd place
    //   { id: 'h1' }  // 3rd place
    // ])
  })
})
