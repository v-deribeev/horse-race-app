import { ref, nextTick } from 'vue'
import { defineStore } from 'pinia'
import type { Horse, RaceRound, RaceResult, RaceState } from '@/domain/types'
import { generateHorses as domainGenerateHorses } from '@/domain/horse.factory'
import { createRaceSchedule } from '@/domain/race.factory'
import { runRaceRound } from '@/domain/race.engine'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const useRaceStore = defineStore('race', () => {
  const horses = ref<Horse[]>([])
  const schedule = ref<RaceRound[]>([])
  const results = ref<RaceResult[]>([])
  const currentRoundIndex = ref<number>(0)
  const raceState = ref<RaceState>('idle')
  const currentRoundResult = ref<RaceResult | null>(null)

  const savedResults = ref<RaceResult[]>([])
  let resolveAnimation: ((value: void) => void) | null = null

  const generateHorses = () => {
    horses.value = domainGenerateHorses(20)
    schedule.value = []
    results.value = []
    savedResults.value = []
    currentRoundIndex.value = 0
    currentRoundResult.value = null
    raceState.value = 'idle'
  }

  const generateSchedule = () => {
    if (horses.value.length === 0) return
    schedule.value = createRaceSchedule(horses.value)
    results.value = []
    savedResults.value = []
    currentRoundIndex.value = 0
    currentRoundResult.value = null
    raceState.value = 'ready'
  }

  const startRace = async (isReplay: boolean = false) => {
    if (raceState.value === 'ready' || (raceState.value === 'finished' && isReplay)) {
      if (isReplay) {
        results.value = []
        currentRoundIndex.value = 0
        currentRoundResult.value = null
      }
      raceState.value = 'running'
    } else {
      return
    }

    while (currentRoundIndex.value < schedule.value.length) {
      if (raceState.value !== 'running') break

      const currentRound = schedule.value[currentRoundIndex.value]
      if (!currentRound) break

      const existingResult = savedResults.value[currentRoundIndex.value]
      if (isReplay && existingResult) {
        currentRoundResult.value = existingResult
      } else {
        const newResult = runRaceRound(currentRound)
        currentRoundResult.value = newResult
        savedResults.value[currentRoundIndex.value] = newResult
      }

      await new Promise<void>((resolve) => {
        resolveAnimation = resolve
      })

      // SKIP ALL TRAP
      if ((raceState.value as RaceState) === 'finished') {
        if (currentRoundResult.value) results.value.push(currentRoundResult.value)
        currentRoundIndex.value++

        while (currentRoundIndex.value < schedule.value.length) {
          const round = schedule.value[currentRoundIndex.value]
          if (round) {
            const res = savedResults.value[currentRoundIndex.value] || runRaceRound(round)
            savedResults.value[currentRoundIndex.value] = res
            results.value.push(res)
            currentRoundResult.value = res
          }
          currentRoundIndex.value++
        }
        currentRoundIndex.value = schedule.value.length - 1
        return
      }

      // Normal Progression
      // --- Normal Progression ---
      if (currentRoundResult.value) {
        results.value.push(currentRoundResult.value)
      }

      // Force Vue to update the ResultsCard
      await nextTick()

      if (currentRoundIndex.value < schedule.value.length - 1) {
        // 1. Wait at the finish line (User sees the podium glow)
        await sleep(2000)

        // 2. Wipe the track
        currentRoundResult.value = null

        // CRITICAL FIX: Force Vue to explicitly render the empty track
        // before we load the new horses.
        await nextTick()

        // 3. Advance to the next round's horses
        currentRoundIndex.value++

        // CRITICAL FIX: Force Vue to explicitly render the new horses
        // at the starting line before the starting gun goes off.
        await nextTick()

        // 4. Brief pause at the starting line
        await sleep(250)
      } else {
        raceState.value = 'finished'
        break
      }
    }
  }

  const skipAll = () => {
    if (raceState.value !== 'running') return
    raceState.value = 'finished'
    if (resolveAnimation) resolveAnimation()
  }

  const completeRoundAnimation = () => {
    if (resolveAnimation) {
      resolveAnimation()
      resolveAnimation = null
    }
  }

  return {
    horses,
    schedule,
    results,
    currentRoundIndex,
    raceState,
    currentRoundResult,
    generateHorses,
    generateSchedule,
    startRace,
    skipAll,
    completeRoundAnimation,
  }
})
