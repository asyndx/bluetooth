<template>
  <BackGround />
  <router-view v-slot="{ Component }">
    <transition name="fade-slide" mode="out-in" appear>
      <component :is="Component" />
    </transition>
  </router-view>
  <DebugTool v-if="appSettings.debug" />
</template>
<script setup>
import { useRoute } from 'vue-router'
import BackGround from '@/components/BackGround.vue'
import DebugTool from '@/components/DebugTool.vue'
import { useAppSettings } from '@/stores/app'

const route = useRoute()
const appSettings = useAppSettings()

if (route.path == '/') {
  if (location.search.includes("debug=1")) {
    appSettings.debug = true
  }
}
</script>
<style>
.app-container {
  width: 1280px;
  height: 800px;
  box-sizing: border-box;
}
.btn {
  border: 1px solid white;
  border-radius: 16px;
  background: #FFFFFF33;
  color: white;
}
.btn:focus {
  background: #FFFFFF66;
}
/* @font-face {
  font-family: 'Noto Sans Arabic';
  src: url('/fonts/NotoSansArabic-Regular.ttf');
} */
body {
  width: 1280px;
  height: 800px;
  margin: 0;
  box-sizing: border-box;
  /* font-family: 'Noto Sans Arabic'; */
}
/* fade-slide */
.fade-slide-leave-active,
.fade-slide-enter-active {
	transition: all 0.3s;
}
.fade-slide-enter-from {
	opacity: 0%;
	transform: translateX(-30px);
}
.fade-slide-leave-to {
	opacity: 0%;
	transform: translateX(30px);
}
</style>
