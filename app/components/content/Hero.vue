<script setup lang="ts">
defineProps({
  src: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: false,
    default: ''
  }
})
</script>

<template>
  <section
      class="relative bg-cover bg-center h-[30vh] flex items-center justify-center w-full"
      :style="{ backgroundImage: `url(${src})` }"
  >
    <div class="relative text-center p-8 flex items-center justify-center">
      <div class="absolute inset-0 bg-white opacity-10 rounded-3xl"></div>

      <div class="prose">
        <h1 class="text-4xl md:text-6xl font-bold tracking-wide">{{ title }}</h1>
        <p v-if="subtitle" class="mt-4 text-lg md:text-xl">{{ subtitle }}</p>
      </div>
    </div>
  </section>
</template>
