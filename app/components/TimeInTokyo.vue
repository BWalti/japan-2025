<template>
  <ClientOnly>
    <div class="time-container">
      <h2>Aktuelle Zeit in Tokyo</h2>
      <p class="time">{{ time }}</p>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
const time = ref('')

let interval : NodeJS.Timeout;

const updateTime = () => {
  const formatter = new Intl.DateTimeFormat('de-CH', {
    timeZone: 'Asia/Tokyo',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
  time.value = formatter.format(new Date())
}

onMounted(() => {
  updateTime()
  interval = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  clearInterval(interval)
})
</script>

<style scoped>
.time-container {
  text-align: center;
  font-family: Arial, sans-serif;
  padding: 1rem;
}

.time {
  font-size: 2rem;
  font-weight: bold;
  margin-top: 0.5rem;
}
</style>
