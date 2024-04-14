<template>
  <div class="wrap-container" />
</template>
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppSettings } from '@/stores/app'
import { useRouter } from 'vue-router'

const router = useRouter()
const appSettings = useAppSettings()
const { worker } = storeToRefs(appSettings)


const toIndex = function() {
  router.push('/')
}

const timer = ref(null)

onMounted(() => {
  console.log("app start")
  timer.value = setTimeout(toIndex, 100 * 1000)
  appSettings.appStart()
})

onUnmounted(() => {
  clearTimeout(worker.value)
  clearInterval(timer.value)
  console.log("app end.")
})
</script>
<style scoped>
.wrap-container {
  width: 100%;
  height: 100%;
}
</style>
