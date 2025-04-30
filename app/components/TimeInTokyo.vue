<template>
  <ClientOnly>
    <div class="time-container">
      <h2>Aktuelle Zeit in Tokyo</h2>
      <p class="time">{{ time }}</p>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
const { time } = useTimezoneTime('Asia/Tokyo');
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
