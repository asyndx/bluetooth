<template>
  <div class="wrap-container">
    <div class="top-container">
      <div class="left-code">
        <div v-for="group in codeGroups" class="code-group">
          <div v-for="code in group" :class="['code-item', code ? 'code-fill' : '']"> {{ code }} </div>
        </div>
      </div>
      <button class="btn btn-del">删除</button>
    </div>
    <div class="bottom-container">
      <div class="left-desc">
        <span class="desc-title">操作说明:</span>
        <span class="desc-body">{{ desc }}</span>
      </div>
      <div class="right-ops">
        <div style="display: flex;">
          <button class="btn btn-input" @click="addCode('0')" :disabled="isFull">0</button>
          <button class="btn btn-input" @click="addCode('1')" :disabled="isFull">1</button>
          <button @click="toRunning" class="btn btn-start">启动</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const NONE = '_'

const codeGroups = ref(new Array(4))
codeGroups.value[0] = ['1', '0']
codeGroups.value[1] = ['', '']
codeGroups.value[2] = ['', '']
codeGroups.value[3] = ['', '']

const desc = ref('该系统输入指令由四组两位二进制数据组成，每组两位二进制数据有00,01,10,11\
四种状态，输入全部二进制数据后点击启动，系统将根据数据产生不同的声音。')


// const init = function () {
//   for (let i = 0; i < codeGroups.value.length; ++i) {
//     codeGroups.value[i] = [NONE, NONE]
//   }
// }
// init()

const isFull = computed(() => {
  return codeGroups.value[codeGroups.value.length - 1][1] != NONE
})
// const isEmpty = computed(() => {
//   return codeGroups.value[0][0] == NONE
// })

// function addCode(val) {
//   for (let i = 0; i < codeGroups.value.length; ++i) {
//     let group = codeGroups.value[i];
//     if (group[0] == NONE) {
//       group[0] = val;
//       break;
//     }
//     if (group[1] == NONE) {
//       group[1] = val;
//       break;
//     }
//   }
// }

// function delCode() {
//   for (let i = codeGroups.value.length - 1; i >= 0; --i) {
//     let group = codeGroups.value[i];
//     if (group[1] != NONE) {
//       group[1] = NONE;
//       break;
//     }
//     if (group[0] != NONE) {
//       group[0] = NONE;
//       break;
//     }
//   }
// }

// const props = defineProps(['characteristic'])

// const router = useRouter()
// function toRunning() {
//   // if (!isFull.value) {
//   //   ElMessage({
//   //     message: "请输入全部数字",
//   //     type: "warning",
//   //   })
//   //   return
//   // }
//   // if (props.characteristic == null) {
//   //   ElMessage({
//   //     message: "未选择特征值",
//   //     type: "warning",
//   //   })
//   //   return
//   // }
//   router.push('/running?code=' + Number.parseInt(codeGroups.value.map(group => group[0] + group[1]).join(''), 2).toString(16))
// }
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
