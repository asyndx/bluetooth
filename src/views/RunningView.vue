<template>
  <div class="container">
    <div class="runtime">{{ time[0] }}:{{ time[1] }}:{{ time[2] }}</div>
    <img :src="file" class="bg-gif" />
    <div class="tips">
      <div> {{ remainSec }}s后自动回到
        <a @click="toIndex" style="color: blue;">首页</a>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const file = ref(import.meta.env.APP_BASE + "assets/cxk1.gif")

const time = ref(['00', '00', '00'])

function toIndex() {
  router.push('/')
}

const code = ref(route.query['code'])
if (typeof code.value != 'string' || code.value.length > 3 || !/^[0-9A-Fa-f]+$/.test(code.value)) {
  code.value = '0'
}

const source = [...Number.parseInt(code.value, 16).toString(4)]
while (source.length < 6) {
  source.unshift('0')
}
for (let i = 0; i < source.length; ++i) {
  source[i] = (i % 3) * 4 + parseInt(source[i]) + 1
}
source.splice(6, 0, 15)
source.splice(3, 0, 14)

const timeInterval = new Array(source.length).fill(20)
timeInterval[0] = 0
timeInterval[4] = 1

const emit = defineEmits(["send"])

const p = ref(0)

const postAction = function(after) {
  if (!(after == 0 && timeInterval[p.value] == 0)) {
    if (after != 0) {
      timeInterval[p.value] -= after
      postAction(0)
    }
    return
  }
  if (p.value >= source.length) {
    return
  }
  const action = new Uint8Array(5)
  action[0] = 0xFF
  action[1] = 0x09
  action[2] = 0x00
  action[3] = source[p.value] & 0xff
  action[4] = (source[p.value] >> 8 ) & 0xff
  emit("send", action)
  p.value += 1
  postAction(0)
}
// https://wit-motion.yuque.com/wumwnr/docs/gfrlph#Nix1r

const calcNext = function(t) {
  postAction(1)
  t = t == undefined ? 2: t;
  if (t >= 0) {
    let next = String(time.value[t] - 0 + 1)
    if (next.length == 1) {
      time.value[t] = '0' + next
    } else if (next == (t == 0 ? '24' : '60')) {
      time.value[t] = '00'
      calcNext(t - 1)
    } else {
      time.value[t] = next
    }
  }
}

const remainSec = ref(300)

postAction(0)

const timer = setInterval(() => {
  calcNext();
  remainSec.value -= 1
  if (remainSec.value == 0) {
    toIndex()
  }
}, 1000)

</script>
<style scoped>
.container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.runtime {
  position: fixed;
  top: 150px;
  font-weight: bold;
  font-size: 1.5em;
}
.bg-gif {
  position: fixed;
  width: 50%;
  height: 50%;
  opacity: 0.7;
}
.tips {
  position: fixed;
  bottom: 100px;
}

</style>
