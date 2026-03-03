<script setup lang="ts">
import { useRaceStore } from '@/stores/race.store'

const raceStore = useRaceStore()
</script>

<template>
  <div class="max-h-150 overflow-y-auto pr-2 custom-scrollbar">
    <ul class="flex flex-col gap-2">
      <li
        v-for="horse in raceStore.horses"
        :key="horse.id"
        class="flex justify-between items-center p-2 mb-2 mr-1 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm bg-white dark:bg-slate-800"
      >
        <div class="flex items-center gap-3">
          <div
            class="w-6 h-6 rounded-full border shadow-inner"
            :style="{ backgroundColor: horse.raceColor }"
          ></div>
          <span class="font-bold text-slate-700 dark:text-slate-200">
            {{ horse.name }}
          </span>
        </div>

        <span
          class="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded font-bold text-sm min-w-[110px] text-center"
        >
          Condition: {{ horse.conditionScore }}
        </span>
      </li>
    </ul>
  </div>
</template>
