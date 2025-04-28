<template>
  <ClientOnly>
    <div class="flex flex-col items-center justify-center p-4">
      <div
          class="cursor-pointer bg-gray-300 dark:bg-gray-600 rounded-2xl p-4 flex items-center space-x-4 shadow-md hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
          @click="open = true"
      >
        <img :src="currentWeatherIconUrl" alt="Weather Icon" class="w-12 h-12">
        <div>
          <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100">{{ location }}</h2>
          <p class="text-lg text-gray-700 dark:text-gray-300">{{ currentTemp }}°C - {{ currentWeather }}</p>
        </div>
      </div>

      <TransitionRoot as="template" :show="open">
        <Dialog as="div" class="relative z-50" @close="open = false">

          <div class="fixed inset-0 bg-black bg-opacity-30"/>

          <div class="fixed inset-0 flex items-center justify-center p-4">
            <DialogPanel
                class="w-full max-w-md rounded-2xl bg-gray-100 dark:bg-gray-700 p-6 shadow-xl transition-all"
            >
              <DialogTitle class="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-4">
                Wettervorhersage
              </DialogTitle>

              <div class="space-y-4">
                <div
                    v-for="day in forecast"
                    :key="day.date"
                    class="flex items-center justify-between bg-gray-200 dark:bg-gray-600 p-3 rounded-xl"
                >
                  <div class="flex items-center space-x-3">
                    <img :src="getWeatherIconUrl(day.icon)" alt="Forecast Icon" class="w-10 h-10">
                    <span class="text-gray-800 dark:text-gray-100">{{ formatDate(day.date) }}</span>
                  </div>
                  <div class="text-right">
                    <p class="text-gray-700 dark:text-gray-300">{{ day.min }}°C / {{ day.max }}°C</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ day.description }}</p>
                  </div>
                </div>
              </div>

              <div class="flex justify-center mt-6">
                <button
                    class="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold"
                    @click="open = false"
                >
                  Schließen
                </button>
              </div>
            </DialogPanel>
          </div>

        </Dialog>
      </TransitionRoot>

    </div>
  </ClientOnly>
</template>

<script setup>
import {Dialog, DialogPanel, DialogTitle, TransitionRoot} from '@headlessui/vue'

const config = useRuntimeConfig()
const apiKey = config.public.weatherApiKey
const location = 'Tokyo'
const open = ref(false)

const currentTemp = ref(null)
const currentWeather = ref('')
const currentWeatherIcon = ref('')
const forecast = ref([])

const currentWeatherIconUrl = computed(() =>
    currentWeatherIcon.value ? `https://openweathermap.org/img/wn/${currentWeatherIcon.value}@2x.png` : ''
)

const getWeatherIconUrl = (icon) =>
    `https://openweathermap.org/img/wn/${icon}@2x.png`

function formatDate(dateString) {
  const options = {weekday: 'short', day: 'numeric', month: 'short'}
  return new Date(dateString).toLocaleDateString('de-DE', options)
}

async function fetchWeather() {
  try {
    const {data: weatherData} = await useFetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&lang=de&appid=${apiKey}`
    )
    currentTemp.value = Math.round(weatherData.value.main.temp)
    currentWeather.value = weatherData.value.weather[0].description
    currentWeatherIcon.value = weatherData.value.weather[0].icon
  } catch (error) {
    console.error('Fehler beim Abrufen des aktuellen Wetters', error)
  }
}

async function fetchForecast() {
  try {
    const {data: forecastData} = await useFetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&lang=de&appid=${apiKey}`
    )
    const daily = {}

    forecastData.value.list.forEach(item => {
      const date = item.dt_txt.split(' ')[0]
      if (!daily[date]) {
        daily[date] = {
          min: item.main.temp_min,
          max: item.main.temp_max,
          icon: item.weather[0].icon,
          description: item.weather[0].description
        }
      } else {
        daily[date].min = Math.min(daily[date].min, item.main.temp_min)
        daily[date].max = Math.max(daily[date].max, item.main.temp_max)
      }
    })

    forecast.value = Object.entries(daily).slice(0, 5).map(([date, info]) => ({
      date,
      min: Math.round(info.min),
      max: Math.round(info.max),
      icon: info.icon,
      description: info.description
    }))
  } catch (error) {
    console.error('Fehler beim Abrufen der Wettervorhersage', error)
  }
}

onMounted(async () => {
  await fetchWeather()
  await fetchForecast()
})
</script>

