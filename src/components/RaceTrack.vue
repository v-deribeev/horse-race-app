<script setup lang="ts">
import { ref, computed, watch, nextTick, onUnmounted } from 'vue'
import { useRaceStore } from '@/stores/race.store'

const raceStore = useRaceStore()

const baseTimeMs = 3000
const horseProgress = ref<Record<string, number>>({})
const placementsMap = ref<Record<string, number>>({})

let animationFrameId: number | null = null
let startTime: number | null = null

const getProgress = (id: string): number => horseProgress.value[id] ?? 0
const getPlacement = (id: string): number => placementsMap.value[id] ?? 999

const currentRound = computed(() => {
  if (raceStore.schedule.length === 0) return null
  return raceStore.schedule[raceStore.currentRoundIndex]
})

watch(
  () => raceStore.currentRoundResult,
  async (newResult) => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
      animationFrameId = null
    }

    // If the store clears the result between rounds, wipe the track clean!
    if (!newResult) {
      horseProgress.value = {}
      placementsMap.value = {}
      return
    }

    if (!currentRound.value) return

    // Pre-calculate target durations and map the placements
    placementsMap.value = {}
    const durations: Record<string, number> = {}
    newResult.placements.forEach((h, index) => {
      durations[h.id] = baseTimeMs + index * 200
      placementsMap.value[h.id] = index + 1
    })

    // "Skip All" handler:
    // If the state is finished, instantly snap all horses to the finish line
    // and abort the animation loop entirely
    if (raceStore.raceState === 'finished') {
      currentRound.value.horses.forEach((h) => {
        horseProgress.value[h.id] = 100
      })
      return
    }

    // Normal Animation Setup
    horseProgress.value = {}

    await nextTick()
    await new Promise((resolve) => requestAnimationFrame(resolve))

    startTime = performance.now()

    const animate = (currentTime: number) => {
      if (!startTime || !currentRound.value) return
      const elapsed = currentTime - startTime
      let allFinished = true

      currentRound.value.horses.forEach((h) => {
        const duration = durations[h.id]
        if (!duration) return
        const progress = Math.min((elapsed / duration) * 100, 100)
        horseProgress.value[h.id] = progress

        if (progress < 100) allFinished = false
      })

      if (allFinished) {
        // UI Safety Buffer: Force the browser to hold the final winning frame
        setTimeout(() => {
          raceStore.completeRoundAnimation()
        }, 1000)
      } else {
        animationFrameId = requestAnimationFrame(animate)
      }
    }

    animationFrameId = requestAnimationFrame(animate)
  },
)

onUnmounted(() => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId)
})
</script>

<template>
  <div
    class="w-full h-full flex flex-col relative overflow-hidden bg-emerald-700 dark:bg-emerald-800 rounded-lg border-4 border-emerald-900 shadow-inner"
  >
    <template v-if="currentRound">
      <div
        class="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-[0.08]"
      >
        <span
          class="text-[8rem] lg:text-[12rem] font-black text-white tracking-tighter leading-none"
        >
          {{ currentRound.length }}m
        </span>
      </div>

      <div class="flex flex-col h-full w-full justify-evenly py-2 z-10 relative">
        <div
          class="absolute right-10 top-0 bottom-0 border-r-[3px] border-dashed border-white/60 z-0 pointer-events-none"
        ></div>

        <div
          v-for="(horse, index) in currentRound.horses"
          :key="horse.id"
          class="relative w-full flex-1 flex items-stretch border-b border-black/10 last:border-b-0"
          :class="{
            'bg-yellow-400/30': getProgress(horse.id) >= 100 && getPlacement(horse.id) === 1,
            'bg-slate-300/30': getProgress(horse.id) >= 100 && getPlacement(horse.id) === 2,
            'bg-amber-700/40': getProgress(horse.id) >= 100 && getPlacement(horse.id) === 3,
            'bg-black/20': getProgress(horse.id) < 100 || getPlacement(horse.id) > 3,
          }"
        >
          <div
            class="w-8 shrink-0 h-full flex items-center justify-center text-xs text-white font-bold border-r border-black/30 shadow-[inset_-2px_0_5px_rgba(0,0,0,0.2)]"
            :style="{
              backgroundColor: `${horse.raceColor}40`,
              borderLeft: `4px solid ${horse.raceColor}`,
            }"
          >
            {{ index + 1 }}
          </div>

          <div class="flex-1 relative h-full">
            <div
              class="absolute top-1/2 -translate-y-1/2 w-18.75 h-[65%] rounded shadow-md flex items-center justify-center text-sm font-bold text-white will-change-transform z-10 transition-transform duration-75"
              :class="{
                'scale-110 z-20 shadow-yellow-500/50 border border-yellow-400':
                  getProgress(horse.id) >= 100 && getPlacement(horse.id) === 1,
              }"
              :style="{
                backgroundColor: horse.raceColor,
                /* Horse Width + Finish Line Gap -> adjust horse placement on track at finish line */
                left: `calc(${getProgress(horse.id)}% - ${(getProgress(horse.id) / 100) * 85}px)`,
              }"
            >
              <span class="drop-shadow-md">{{ horse.name.split('-')[1] }}</span>
            </div>

            <div
              v-if="getProgress(horse.id) >= 100 && getPlacement(horse.id) <= 3"
              class="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
            >
              <span
                class="font-black text-2xl italic tracking-widest drop-shadow-lg animate-placement-pop"
                :class="{
                  'text-yellow-400': getPlacement(horse.id) === 1,
                  'text-slate-200': getPlacement(horse.id) === 2,
                  'text-amber-500': getPlacement(horse.id) === 3,
                }"
              >
                {{
                  getPlacement(horse.id) === 1
                    ? '1st'
                    : getPlacement(horse.id) === 2
                      ? '2nd'
                      : '3rd'
                }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </template>

    <div v-else class="text-white text-center m-auto font-medium opacity-70">
      Generate a schedule to prepare the track.
    </div>
  </div>
</template>

<style scoped>
.animate-placement-pop {
  animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

@keyframes popIn {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  100% {
    opacity: 0.9;
    transform: scale(1);
  }
}
</style>
