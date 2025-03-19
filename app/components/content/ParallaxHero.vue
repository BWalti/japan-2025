<template>
  <ClientOnly>
    <section
        ref="heroSection"
        class="relative h-[40vh] overflow-hidden flex items-center justify-center not-prose"
        @scroll="handleScroll"
    >
      <!-- Background Image -->
      <div
          class="absolute top-0 left-0 w-full h-full bg-cover bg-center"
          :style="{ transform: `translateY(${offsetY}px)`, backgroundImage: `url('${src}')` }"
      ></div>

      <!-- Centered Content -->
      <div class="relative z-10 text-center py-4 px-8">
        <div
            class="absolute -z-10 top-0 left-0 w-full h-full rounded-2xl bg-white dark:bg-gray-800 opacity-50 backdrop-blur-md"></div>

        <h1 class="text-4xl md:text-6xl font-bold tracking-wide">{{ title }}</h1>
        <p v-if="subtitle" class="mt-4 text-lg md:text-xl font-semibold">{{ subtitle }}</p>
      </div>
    </section>
  </ClientOnly>
</template>

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
  },
});


// Reactive State
const offsetY = ref(0);
const heroSection = useTemplateRef('heroSection')

// Methods
const handleScroll = () => {
  if (!heroSection.value) return;
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  offsetY.value = scrollTop / 2; // Adjust the divisor to control parallax speed
};

// Lifecycle Hooks
onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});

</script>
