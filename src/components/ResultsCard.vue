<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRaceStore } from '@/stores/race.store'

const raceStore = useRaceStore()

// Track which round is expanded
const expandedRound = ref<number | null>(null)

const toggle = (roundNum: number) => {
  expandedRound.value = expandedRound.value === roundNum ? null : roundNum
}

// Auto-expand the latest result as soon as it arrives
watch(
  () => raceStore.results.length,
  (newLength) => {
    if (newLength > 0) {
      // Safely get the last result's round number
      const latestResult = raceStore.results[newLength - 1]
      if (latestResult) {
        expandedRound.value = latestResult.roundNumber
      }
    } else {
      expandedRound.value = null // Reset if cleared
    }
  },
  { immediate: true }, // Run on mount in case results already exist
)
</script>

<template>
  <div class="flex flex-col gap-2">
    <div
      v-if="raceStore.results.length === 0"
      class="text-sm text-slate-500 dark:text-slate-400 italic text-center mt-4"
    >
      Awaiting race results...
    </div>

    <div
      v-for="result in raceStore.results"
      :key="result.roundNumber"
      class="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800 shadow-sm transition-colors"
      :class="[
        expandedRound === result.roundNumber
          ? 'border-emerald-400 dark:border-emerald-600'
          : 'border-slate-200 dark:border-slate-700',
      ]"
    >
      <button
        @click="toggle(result.roundNumber)"
        class="w-full flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
      >
        <span class="font-bold text-slate-800 dark:text-slate-200 text-sm">
          Round {{ result.roundNumber }}
        </span>
        <div class="flex items-center gap-3">
          <span
            class="text-xs text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded"
          >
            {{ result.length }}m
          </span>
          <span class="text-slate-400 text-xs w-4">
            {{ expandedRound === result.roundNumber ? '▲' : '▼' }}
          </span>
        </div>
      </button>

      <div
        v-show="expandedRound === result.roundNumber"
        class="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-1"
      >
        <ul class="flex flex-col">
          <li
            v-for="(horse, index) in result.placements"
            :key="horse.id"
            class="flex items-center gap-3 px-3 py-1.5 border-b last:border-b-0 border-slate-100 dark:border-slate-700/50 text-sm hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
          >
            <div
              class="w-6 font-bold text-center shrink-0"
              :class="{
                'text-yellow-500 text-base drop-shadow-sm': index === 0,
                'text-slate-400 text-base': index === 1,
                'text-amber-600 text-base': index === 2,
                'text-slate-400 dark:text-slate-500 text-xs': index > 2,
              }"
            >
              {{ index + 1 }}
            </div>

            <div
              class="w-3 h-3 rounded-full border border-black/20 shrink-0"
              :style="{ backgroundColor: horse.raceColor }"
            ></div>

            <span class="font-medium text-slate-700 dark:text-slate-300 truncate">
              {{ horse.name }}
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
