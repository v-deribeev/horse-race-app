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
        class="flex items-center justify-between p-2 rounded border bg-slate-50 hover:bg-slate-100 transition-colors"
      >
        <div class="flex items-center gap-3">
          <div
            class="w-6 h-6 rounded-full shadow-sm border border-black/10"
            :style="{ backgroundColor: horse.raceColor }"
          ></div>
          <span class="font-medium text-slate-700">{{ horse.name }}</span>
        </div>
        <div class="text-xs font-bold text-slate-500 bg-slate-200 px-2 py-1 rounded">
          Cond: {{ horse.conditionScore }}
        </div>
      </li>
    </ul>
  </div>
</template>
