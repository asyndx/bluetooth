<template>
  <img :src="`/images/${ route.path == '/running' ? 'particle' : 'starry' }.gif`" class="bg-gif" />
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
</style>
