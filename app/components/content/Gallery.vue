<template>
  <div class="bg-amber-50 dark:bg-gray-900 not-prose py-8">
    <div class="flex flex-wrap gap-6 justify-center">
      <div
          v-for="image in images"
          :key="image.src"
          class="flex flex-col">
        <NuxtImg
            :alt="image.alt"
            :src="image.src"
            class="max-w-full md:max-w-3xl mx-auto h-auto object-cover cursor-pointer"
            @click="openLightbox(image)"/>

        <span class="text-center max-w-full mx-2 wrap-break-word">{{ image.alt }}</span>
      </div>
    </div>

    <div
        v-if="showLightbox" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50"
        @click="closeLightbox">
      <div class="relative">
        <NuxtImg :alt="currentImage.alt" :src="currentImage.src" class="max-w-full max-h-screen"/>
        <span class="max-w-full mx-2 wrap-break-word">{{ currentImage.alt }}</span>
      </div>

      <button
          class="cursor-pointer absolute left-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-white dark:bg-gray-800 bg-opacity-25 hover:bg-opacity-50 p-2 rounded-full text-black dark:text-gray-100"
          @click.stop="prevImage">
        &lt;
      </button>
      <button
          class="cursor-pointer absolute right-4 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-white dark:bg-gray-800 bg-opacity-25 hover:bg-opacity-50 p-2 rounded-full text-black dark:text-gray-100"
          @click.stop="nextImage">
        &gt;
      </button>
      <button
          class="cursor-pointer absolute top-4 right-4 bg-primary hover:bg-primary-content text-white dark:text-gray-100 rounded-full w-8 h-8 flex items-center justify-center"
          @click.stop="closeLightbox">
        ✕
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  images: {
    type: Array as PropType<ImageSrcWithAlt[]>,
    required: true
  }
});

const showLightbox = ref(false);
const currentIndex = ref(0);

const openLightbox = (image: string) => {
  currentIndex.value = props.images.indexOf(image);
  showLightbox.value = true;
  addKeydownListener();
};

const closeLightbox = () => {
  showLightbox.value = false;
  removeKeydownListener();
};

const prevImage = () => {
  currentIndex.value = (currentIndex.value - 1 + props.images.length) % props.images.length;
};

const nextImage = () => {
  currentIndex.value = (currentIndex.value + 1) % props.images.length;
};

const currentImage: ImageSrcWithAlt = computed(() => props.images[currentIndex.value]);

const handleKeydown = (event: KeyboardEvent) => {
  if (showLightbox.value) {
    switch (event.key) {
      case 'ArrowLeft':
        prevImage();
        break;
      case 'ArrowRight':
        nextImage();
        break;
      case 'Escape':
        closeLightbox();
        break;
    }
  }
};

const addKeydownListener = () => {
  window.addEventListener('keydown', handleKeydown);
};

const removeKeydownListener = () => {
  window.removeEventListener('keydown', handleKeydown);
};

// Ensure listeners are removed when the component is unmounted
onBeforeUnmount(() => {
  removeKeydownListener();
});
</script>
