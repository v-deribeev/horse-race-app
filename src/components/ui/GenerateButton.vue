<template>
  <button
    class="px-4 py-2 bg-indigo-600 text-white rounded shadow hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold uppercase tracking-wide"
    v-bind="$attrs"
  >
    <slot>Generate</slot>
  </button>
</template>
