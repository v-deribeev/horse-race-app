<script setup lang="ts">
import { ref } from 'vue'
import { useRaceStore } from '@/stores/race.store'

const raceStore = useRaceStore()

// This keeps track of which round is currently expanded
const expandedRound = ref<number | null>(null)

const toggle = (roundNum: number) => {
  expandedRound.value = expandedRound.value === roundNum ? null : roundNum
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <div
      v-if="raceStore.schedule.length === 0"
      class="text-sm text-slate-500 dark:text-slate-400 italic text-center mt-4"
    >
      No schedule generated yet.
    </div>

    <div
      v-for="round in raceStore.schedule"
      :key="round.roundNumber"
      class="border rounded-lg overflow-hidden transition-colors"
      :class="[
        // Highlight the current active round with an indigo border
        raceStore.currentRoundIndex === round.roundNumber - 1 && raceStore.raceState !== 'idle'
          ? 'border-indigo-400 dark:border-indigo-600'
          : 'border-slate-200 dark:border-slate-700',
      ]"
    >
      <button
        @click="toggle(round.roundNumber)"
        class="w-full flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
      >
        <span class="font-bold text-slate-700 dark:text-slate-200"
          >Round {{ round.roundNumber }}</span
        >
        <div class="flex items-center gap-3">
          <span
            class="text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/50 px-2 py-1 rounded"
          >
            {{ round.length }}m
          </span>
          <span class="text-slate-400 text-xs w-4">
            {{ expandedRound === round.roundNumber ? '▲' : '▼' }}
          </span>
        </div>
      </button>

      <div
        v-show="expandedRound === round.roundNumber"
        class="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2"
      >
        <ul class="flex flex-col gap-1.5">
          <li
            v-for="(horse, index) in round.horses"
            :key="horse.id"
            class="flex items-center gap-3 p-1.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-sm"
          >
            <span
              class="w-6 h-6 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center text-xs font-bold shrink-0"
            >
              {{ index + 1 }}
            </span>

            <div
              class="w-8 h-6 rounded shadow-sm flex items-center justify-center text-xs font-bold text-white shrink-0"
              :style="{ backgroundColor: horse.raceColor }"
            >
              {{ horse.name.split('-')[1] }}
            </div>

            <span class="text-slate-700 dark:text-slate-300 font-medium truncate">
              {{ horse.name }}
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
