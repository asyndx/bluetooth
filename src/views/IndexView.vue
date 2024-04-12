<template>
  <div class="wrap-container">
    <div class="project-desc">
      <span>{{ desc }}</span>
    </div>
    <div style="width: 1026px;">
      <button @click="e => blurAfterClick(e, 'p1start') || toOperate()" class="btn btn-start">开始程序</button>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useAppSettings } from '@/stores/app'
import { useFullscreen } from '@vueuse/core'

const appSettings = useAppSettings()

const { blurAfterClick, autoConnect } = appSettings
const { characteristic } = storeToRefs(appSettings)

const desc = ref('“啸叫”是扩音系统中经常出现的一种“不正常”现象，是声反馈过量的一种表现。近年来，人们关注的信息\
领域会习惯性地被自己无意识间输入的“指令”所引导，原始信息通过算法推送机制引导后狭窄化、定式化，某种程度上人们被动\
地将自己的生活桎梏于像蚕茧一般的“信息茧房”中。「徊 · 流」声音互动装置使用交互艺术的语言构建两者之间的联系，拟通过\
啸叫发声，将信息茧房现象再现于方寸之间。')

const router = useRouter()

const { isFullscreen, isSupported, enter } = useFullscreen()
const toOperate = function () {
  // if (isSupported.value && !isFullscreen.value) {
  //   enter()
  // }
  if (!characteristic.value) {
    autoConnect().then(() => {
      router.push('/operate')
    }).catch(err => {})
  } else {
    router.push('/operate')
  }
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
  height: 336px;
  border-radius: 23px;
  margin-top: 192px;
  padding: 46px 26px 35px 50px;
  box-sizing: border-box;
  background: #FFFFFF33;
  line-height: 50.69px;
  font-size: 24px;
  font-weight: 400;
  color: white;
  text-align: center;
}
.btn-start {
  width: 256px;
  height: 66px;
  margin-top: 66px;
  margin-left: 725px;
  line-height: 66px;
  font-size: 25px;
  font-weight: 400;
}
</style>
