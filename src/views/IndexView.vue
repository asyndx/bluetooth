<template>
  <div class="wrap-container">
    <div class="btn-group">
      <div class="btn-circle" @click="fullScreen()" @touchstart="handleTouchstart()" @touchend="handleTouchend()" >
        <svg width="41" height="41" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20.5" cy="20.5" r="20" stroke="white" stroke-width="1" :fill="isPressed ? 'white' : ''" :fill-opacity="isPressed ? '0.55' : '0'" />
          <path d="M26 12L30 12C30.5523 12 31 12.4477 31 13L31 17" stroke="white" stroke-width="2" stroke-linecap="round" />
          <path d="M10 17V13C10 12.4477 10.4477 12 11 12H15" stroke="white" stroke-width="2" stroke-linecap="round" />
          <path d="M15 31L11 31C10.4477 31 10 30.5523 10 30L10 26" stroke="white" stroke-width="2" stroke-linecap="round" />
          <path d="M31 26L31 30C31 30.5523 30.5523 31 30 31L26 31" stroke="white" stroke-width="2" stroke-linecap="round" />
        </svg>
      </div>
      <div class="btn-circle" @click="autoConnect()">
        <svg width="41" height="41" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11 30.072L28.1137 14.9511C28.5774 14.5414 28.5615 13.8133 28.0805 13.4242L21.7674 8.3176C21.1135 7.78868 20.1385 8.25407 20.1385 9.09509V32.9049C20.1385 33.7459 21.1135 34.2113 21.7674 33.6824L28.0388 28.6095C28.5336 28.2092 28.5336 27.4548 28.0388 27.0545L11 13.272" stroke="white" stroke-width="2" stroke-linecap="round" />
          <circle cx="20.5" cy="20.5" r="20" :fill="characteristic ? 'white' : ''" :fill-opacity="characteristic ? '0.55' : '0'" stroke="white" stroke-width="1" />
        </svg>
      </div>
    </div>
    <div class="project-desc">
      <div>{{ desc1 }}</div>
      <div>{{ desc2 }}</div>
    </div>
    <button @click="e => blurAfterClick(e, 'p1start') || toOperate()" class="btn btn-start">开始程序</button>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useAppSettings } from '@/stores/app'
import { useFullscreen } from '@vueuse/core'

const appSettings = useAppSettings()

const { blurAfterClick, autoConnect, send } = appSettings
const { characteristic } = storeToRefs(appSettings)

const desc1 = ref('“啸叫”是扩音系统中经常出现的一种“不正常”现象，是声反馈过量的一种表现。近年来，人们关注的信息\
领域会习惯性地被自己无意识间输入的“指令”所引导，原始信息通过算法推送机制引导后狭窄化、定式化，某种程度上人们被动\
地将自己的生活桎梏于像蚕茧一般的“信息茧房”中。')
const desc2 = ref('「徊 · 流」声音互动装置使用交互艺术的语言构建两者之间的联系，拟通过\
啸叫发声，将信息茧房现象再现于方寸之间。')

const router = useRouter()

const { isFullscreen, isSupported, enter, exit } = useFullscreen()
const toOperate = function () {
  if (characteristic.value) {
    router.push('/operate')
  } else {
    ElMessage({
      message: "请先连接蓝牙！",
      type: "warning",
    })
  }
}

const count = ref(0)

const fullScreen = function () {
  if (!isFullscreen.value && isSupported.value) {
    enter()
  } else {
    count.value += 1
    console.log("current click count: ", count.value)
    if (count.value % 5 == 0) {
      if (characteristic.value) {
        const action = new Uint8Array(5)
        action[0] = 0xFF
        action[1] = 0x09
        action[2] = 0x00
        action[3] = 0x00
        action[4] = 0x00
        send(action)
      } else {
        ElMessage({
          message: "发送动作组 0 前请先连接蓝牙！",
          type: "warning",
        })
      }
    }
  }
}

const startTime = ref(new Date().getTime())

const isPressed = ref(false)
const timer = ref(null)

const handleTouchstart = function () {
  startTime.value = new Date().getTime()
  isPressed.value = true
}

const handleTouchend = function () {
  if (new Date().getTime() - startTime.value > 3 * 1000 && isFullscreen.value) {
    exit()
  }
  if (timer.value) {
    clearTimeout(timer)
  }
  timer.value = setTimeout(() => {
    isPressed.value = false
    timer.value = null
  }, 150)
}

</script>
<style scoped>
.wrap-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.project-desc {
  width: 1026px;
  height: 376px;
  border-radius: 23px;
  margin-top: 172px;
  padding: 40px 48px 48px 48px;
  box-sizing: border-box;
  background: #FFFFFF33;
  line-height: 48px;
  font-size: 24px;
  font-weight: 400;
  color: white;
  text-align: justify;
  text-indent: 2em;
}
.btn-start {
  width: 256px;
  height: 66px;
  margin-top: 66px;
  line-height: 66px;
  font-size: 25px;
  font-weight: 400;
}
.btn-group {
  position: absolute;
  right: 42px;
  top: 42px;
  display: flex;
  justify-content: flex-end;
}
.btn-circle {
  margin-right: 23px;
}
</style>
