<template>
  <!-- <img :src="`/images/${ route.path == '/running' ? 'particle' : 'starry' }.gif`" class="bg-gif" /> -->
  <img src="/images/particle.gif" v-show="route.path == '/running'" class="bg-gif" />
  <transition name="fade">
    <img src="/images/starry.gif" v-show="route.path != '/running'" class="bg-gif" />
  </transition>
</template>
<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
</script>
<style scoped>
.bg-gif {
  width: 1280px;
  height: 800px;
  position: absolute;
  z-index: -1;
}
.fade-leave-active {
  transition: opacity 2s
}
.fade-leave-to {
  opacity: 0
}
</style>
