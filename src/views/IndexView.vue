
<template>
  <div class="container">
    <div class="project-desc">
      <span>徊·流项目介绍</span>
    </div>
    <button @click="toOperate" class="btn-start">全屏开始程序</button>
  </div>
</template>
<script setup>
import { useRouter } from 'vue-router'
import { useFullscreen } from '@vueuse/core'
const { enter } = useFullscreen()

const router = useRouter()
const toOperate = function () {
  router.push('/operate')
  enter()
}

</script>
<style scoped>
.container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.project-desc {
  border: 2px solid black;
  width: 70%;
  height: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.btn-start {
  position: fixed;
  right: 100px;
  bottom: 100px;
  width: 100px;
  height: 50px;
}
</style>
