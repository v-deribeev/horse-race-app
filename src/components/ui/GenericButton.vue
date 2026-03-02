<template>
  <button
    class="px-4 py-2 bg-gray-200 text-gray-800 rounded shadow hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>
