<script setup lang="ts">
import { onMounted } from 'vue'
import { useRaceStore } from '@/stores/race.store'
import GenerateButton from '@/components/ui/GenerateButton.vue'
import GenericButton from '@/components/ui/GenericButton.vue'
import HorseListCard from '@/components/HorseListCard.vue'
import RaceScheduleCard from '@/components/RaceScheduleCard.vue'
import RaceTrack from '@/components/RaceTrack.vue'
import ResultsCard from '@/components/ResultsCard.vue'

const raceStore = useRaceStore()

onMounted(() => {
  raceStore.generateHorses()
})
</script>

<template>
  <main
    class="min-h-screen lg:h-screen flex flex-col bg-slate-50 dark:bg-slate-900 p-4 text-slate-900 dark:text-slate-100 transition-colors duration-300 overflow-x-hidden lg:overflow-hidden"
  >
    <header
      class="mb-4 flex flex-col md:flex-row gap-4 items-center border-b pb-4 border-slate-200 dark:border-slate-700 text-center md:text-left shrink-0"
    >
      <h1 class="text-2xl font-bold md:mr-auto">Horse Racing Simulator</h1>

      <div class="flex flex-wrap justify-center gap-2">
        <GenerateButton
          @click="raceStore.generateHorses"
          :disabled="raceStore.raceState === 'running'"
        >
          Reroll Horses
        </GenerateButton>

        <GenerateButton
          @click="raceStore.generateSchedule"
          :disabled="raceStore.raceState === 'running'"
        >
          Generate Schedule
        </GenerateButton>

        <GenericButton
          v-if="['idle', 'ready'].includes(raceStore.raceState)"
          @click="raceStore.startRace(false)"
          :disabled="raceStore.raceState === 'idle'"
          class="bg-emerald-600! text-white! hover:bg-emerald-700! disabled:bg-slate-300! dark:disabled:bg-slate-700! disabled:text-slate-500! w-full md:w-auto min-w-30"
        >
          Start Race
        </GenericButton>

        <GenericButton
          v-if="raceStore.raceState === 'running'"
          @click="raceStore.skipAll"
          class="bg-rose-500! text-white! hover:bg-rose-600! w-full md:w-auto min-w-30"
        >
          Skip All
        </GenericButton>

        <GenericButton
          v-if="raceStore.raceState === 'finished'"
          @click="raceStore.startRace(true)"
          class="bg-blue-500! text-white! hover:bg-blue-600! w-full md:w-auto min-w-30"
        >
          Replay Race
        </GenericButton>
      </div>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-15 gap-4 flex-1 lg:min-h-0 pb-8 lg:pb-0">
      <div
        class="order-2 lg:order-1 lg:col-span-3 flex flex-col bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden h-75 lg:h-full"
      >
        <h2
          class="font-bold text-base p-3 border-b border-slate-200 dark:border-slate-700 shrink-0"
        >
          Horse Roster ({{ raceStore.horses.length }})
        </h2>
        <div class="flex-1 overflow-y-auto p-3 custom-scrollbar">
          <HorseListCard />
        </div>
      </div>

      <div
        class="order-1 lg:order-2 lg:col-span-6 flex flex-col bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden min-h-112.5 lg:min-h-0 lg:h-full"
      >
        <div
          class="flex justify-between items-center p-3 border-b border-slate-200 dark:border-slate-700 shrink-0"
        >
          <h2 class="font-bold text-base">
            Race Track
            <span
              v-if="raceStore.raceState !== 'idle' && raceStore.schedule.length > 0"
              class="font-normal text-sm text-slate-500 dark:text-slate-400 ml-1"
            >
              ({{ raceStore.schedule[raceStore.currentRoundIndex]?.length }}m)
            </span>
          </h2>
          <span
            v-if="raceStore.raceState !== 'idle'"
            class="text-xs font-bold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-400 px-2 py-1 rounded-full"
          >
            Round {{ raceStore.currentRoundIndex + 1 }}
          </span>
        </div>
        <div class="flex-1 p-3 overflow-hidden">
          <RaceTrack />
        </div>
      </div>

      <div
        class="order-3 lg:col-span-3 flex flex-col bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden h-75 lg:h-full"
      >
        <h2
          class="font-bold text-base p-3 border-b border-slate-200 dark:border-slate-700 shrink-0"
        >
          Schedule
        </h2>
        <div class="flex-1 overflow-y-auto p-3 custom-scrollbar">
          <RaceScheduleCard />
        </div>
      </div>

      <div
        class="order-4 lg:col-span-3 flex flex-col bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden h-75 lg:h-full"
      >
        <h2
          class="font-bold text-base p-3 border-b border-slate-200 dark:border-slate-700 shrink-0"
        >
          Results
        </h2>
        <div class="flex-1 overflow-y-auto p-3 custom-scrollbar">
          <ResultsCard />
        </div>
      </div>
    </div>
  </main>
</template>
