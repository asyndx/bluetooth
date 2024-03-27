<template>
  <div class="container">
    <div class="code-container">
      <div v-for="group in codeGroups" class="code-group">
        <div v-for="code in group" class="code-item"> {{ code }} </div>
      </div>
    </div>
    <div class="main-container">
      <div class="main-left">
        <span>操作说明</span>
      </div>
      <div class="main-right">
        <div class="btns-top">
          <button @click="delCode" class="btn-del" :disabled="isEmpty">删除</button>
        </div>
        <div class="btns-bottom">
          <button class="btn-input" @click="addCode('0')" :disabled="isFull">0</button>
          <button class="btn-input" @click="addCode('1')" :disabled="isFull">1</button>
          <button @click="toRunning" class="btn-start">启动</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const NONE = '_'

const codeGroups = ref(new Array(6))
const init = function () {
  for (let i = 0; i < codeGroups.value.length; ++i) {
    codeGroups.value[i] = [NONE, NONE]
  }
}
init()

const isFull = computed(() => {
  return codeGroups.value[codeGroups.value.length - 1][1] != NONE
})
const isEmpty = computed(() => {
  return codeGroups.value[0][0] == NONE
})

function addCode(val) {
  for (let i = 0; i < codeGroups.value.length; ++i) {
    let group = codeGroups.value[i];
    if (group[0] == NONE) {
      group[0] = val;
      break;
    }
    if (group[1] == NONE) {
      group[1] = val;
      break;
    }
  }
}

function delCode() {
  for (let i = codeGroups.value.length - 1; i >= 0; --i) {
    let group = codeGroups.value[i];
    if (group[1] != NONE) {
      group[1] = NONE;
      break;
    }
    if (group[0] != NONE) {
      group[0] = NONE;
      break;
    }
  }
}

const props = defineProps(['characteristic'])

const router = useRouter()
function toRunning() {
  if (!isFull.value) {
    ElMessage({
      message: "请输入全部数字",
      type: "warning",
    })
    return
  }
  if (props.characteristic == null) {
    ElMessage({
      message: "未选择特征值",
      type: "warning",
    })
    return
  }
  router.push('/running?code=' + Number.parseInt(codeGroups.value.map(group => group[0] + group[1]).join(''), 2).toString(16))
}
</script>
<style scoped>
.container {
  width: 100%;
  height: 100vh;
}
.code-container {
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 200px;
}
.code-group {
  display: flex;
  justify-content: space-between;
  margin-right: 20px;
}
.code-group:last-child {
  margin-right: 0px;
}
.code-item {
  width: 1.8em;
  height: 3em;
  line-height: 3em;
  text-align: center;
  border: 2px solid black;
  margin-right: 3px;
}
.code-item:last-child {
  margin-right: 0px;
}
.main-container {
  display: flex;
  justify-content: space-around;
  margin-top: 60px;
  height: 200px;
}
.main-left {
  border: 2px solid black;
  border-radius: 10px;
  display: flex;
  width: 400px;
  height: 100%;
  justify-content: center;
  align-items: center;
}
.main-right {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.btns-top {
  display: flex;
  justify-content: flex-end;
}
.btn-del {
  width: 100px;
  height: 60px;
}
.btn-input {
  width: 60px;
  height: 90px;
  margin-right: 30px;
}
.btn-start {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}
</style>