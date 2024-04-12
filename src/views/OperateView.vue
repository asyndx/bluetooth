<template>
  <div class="wrap-container">
    <div class="top-container">
      <div class="left-code">
        <div v-for="group, idx in codeGroups" class="code-group">
          <div v-for="code, i in group" :class="['code-item', code ? 'code-fill' : '']">
            <span>{{ code }}</span>
            <div class="blink-cursor" v-if="codeIndex == idx * 2 + i">|</div>
          </div>
        </div>
      </div>
      <button class="btn btn-del" @click="e => blurAfterClick(e, 'delCode') || delCode()" :disabled="isEmpty()">删除</button>
    </div>
    <div class="bottom-container">
      <div class="left-desc">
        <span class="desc-title">操作说明:</span>
        <span class="desc-body">该系统输入指令由四组两位二进制数据组成，每组两位二进制数据有<span class="code-highlight"> 00,01,10,11 </span>四种状态，输入全部二进制数据后点击启动，系统将根据数据产生不同的声音。</span>
      </div>
      <div class="right-ops">
        <div style="display: flex;">
          <button class="btn btn-input" @click="e => blurAfterClick(e, 'addCode0') || addCode('0')" :disabled="isFull()">0</button>
          <button class="btn btn-input" @click="e => blurAfterClick(e, 'addCode1') || addCode('1')" :disabled="isFull()">1</button>
          <button class="btn btn-start" @click="e => blurAfterClick(e, 'p2start') || toRunning()" :disabled="!isFull()">启动</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useAppSettings } from '@/stores/app'

const appSettings = useAppSettings()

const { initCodeGroups, isFull, isEmpty, addCode, delCode, blurAfterClick } = appSettings
const { codeGroups, codeIndex } = storeToRefs(appSettings)

initCodeGroups()

const router = useRouter()
const toRunning = function () {
  router.push('/running')
}
</script>
<style scoped>
.wrap-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.top-container {
  height: 100px;
  margin: 188px 79px 0 80px;
  display: flex;
  justify-content: space-between;
}
.left-code {
  display: flex;
  flex-direction: row;
}
.code-group {
  display: flex;
  justify-content: space-between;
  margin-right: 30px;
}
.code-group:last-child {
  margin-right: 0px;
}
.code-item {
  width: 72px;
  height: 100px;
  margin-right: 18px;
  box-sizing: border-box;
  border-radius: 11px;
  border: 1px solid white;
  background: #FFFFFF33;
  font-size: 68px;
  font-weight: 400;
  line-height: 100px;
  text-align: center;
  color: white;
  align-items: center;
}
.code-fill {
  background: #FFFFFF66;
}
.code-item:last-child {
  margin-right: 0px;
}
@keyframes blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
.blink-cursor {
  animation: blink 1s infinite;
  width: 30px;
  font-size: 48px;
  align-items: center;
  margin-top: -4px;
}
.btn-del {
  margin-top: 18px;
  width: 163px;
  height: 66px;
  box-sizing: border-box;
  line-height: 66px;
  font-size: 25px;
  font-weight: 400;
}
.bottom-container {
  height: 274px;
  margin: 96px 79px 0 80px;
  display: flex;
  justify-content: space-between;
}
.left-desc {
  width: 545px;
  height: 274px;
  border-radius: 13px;
  background: #FFFFFF33;
  padding-top: 16px;
  box-sizing: border-box;
}
.desc-title {
  margin-left: 43px;
  line-height: 50.69px;
  font-size: 24px;
  font-weight: 400;
  color: white;
}
.desc-body {
  display: block;
  margin-left: 44px;
  margin-right: 43px;
  line-height: 42.24px;
  font-size: 20px;
  font-weight: 100;
  color: white;
}
.code-highlight {
  color: #FFFFFF66;
}
.right-ops {
  display: flex;
  margin-bottom: 7px;
  flex-direction: column-reverse;
}
.btn-input {
  width: 92px;
  height: 125px;
  margin-right: 25px;
  line-height: 125px;
  font-size: 64px;
  font-weight: 400;
}
.btn-start {
  width: 237px;
  height: 125px;
  line-height: 125px;
  font-size: 36px;
  font-weight: 400;
}
</style>
