import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useRaceStore } from '../../stores/race.store'

// MOCK: Entirely fake the domain layer so the store doesn't run actual game math
vi.mock('@/domain/horse.factory', () => ({
  generateHorses: vi.fn(() => [{ id: 'mock1', name: 'Mock Horse' }]),
}))

vi.mock('@/domain/race.factory', () => ({
  createRaceSchedule: vi.fn(() => [{ roundNumber: 1, length: 1200, horses: [] }]),
}))

describe('Store: Race Store', () => {
  let store: ReturnType<typeof useRaceStore>

  beforeEach(() => {
    // Pinia stores must be initialized before each test
    setActivePinia(createPinia())
    store = useRaceStore()
    vi.clearAllMocks()
  })

  it('initializes with the correct default idle state', () => {
    expect(store.horses).toEqual([])
    expect(store.schedule).toEqual([])
    expect(store.raceState).toBe('idle')
  })

  it('generateHorses updates state correctly using mocked factory', () => {
    store.generateHorses()

    // Asserts the array has exactly 1 item, and it's our mock object!
    expect(store.horses).toEqual([{ id: 'mock1', name: 'Mock Horse' }])
    // Checks that the array's first item contains at least the name 'Mock Horse'
    // expect(store.horses).toMatchObject([{ name: 'Mock Horse' }])
    expect(store.raceState).toBe('idle')
  })

  it('generateSchedule transitions state to ready', () => {
    // Add a fake horse so it doesn't return early
    store.horses = [{ id: 'mock1', name: 'Mock', conditionScore: 50, raceColor: '' }]

    store.generateSchedule()

    expect(store.schedule.length).toBe(1)
    expect(store.raceState).toBe('ready')
  })

  it('skipAll forces state to finished instantly', () => {
    store.raceState = 'running' // Fake that we are mid-race
    store.skipAll()
    expect(store.raceState).toBe('finished')
  })
})
