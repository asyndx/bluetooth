<template>
  <div class="wrap-container" />
</template>
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAppSettings } from '@/stores/app'
import { useRouter } from 'vue-router'

const router = useRouter()
const appSettings = useAppSettings()

const toIndex = function() {
  router.push('/')
}

const timer = ref(null)

onMounted(() => {
  timer.value = setTimeout(toIndex, 5 * 60 * 1000)
  appSettings.appStart()
})

onUnmounted(() => {
  clearInterval(timer.value)
})
</script>
<style scoped>
.wrap-container {
  width: 100%;
  height: 100%;
}
</style>
