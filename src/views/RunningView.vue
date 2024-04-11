<template>
  <div class="wrap-container" />
</template>
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAppSettings } from '@/stores/app'
import { useRouter } from 'vue-router'

const router = useRouter()
const appSettings = useAppSettings()

const toIndex = function() {
  router.push('/')
}

const timer = ref(null)

onMounted(() => {
  timer.value = setTimeout(toIndex, 300 * 1000)
  appSettings.appStart()
})

onUnmounted(() => {
  clearInterval(timer.value)
})

// const router = useRouter()
// const route = useRoute()

// const time = ref(['00', '00', '00'])

// function toIndex() {
//   router.push('/')
// }

// const code = ref(route.query['code'])
// if (typeof code.value != 'string' || code.value.length > 3 || !/^[0-9A-Fa-f]+$/.test(code.value)) {
//   code.value = '0'
// }

// const source = [...Number.parseInt(code.value, 16).toString(4)]
// while (source.length < 6) {
//   source.unshift('0')
// }
// for (let i = 0; i < source.length; ++i) {
//   source[i] = (i % 3) * 4 + parseInt(source[i]) + 1
// }
// source.splice(6, 0, 15)
// source.splice(3, 0, 14)

// const sourceStr = source.join(' ') + '\n'

// const props = defineProps(['timeInterval'])

// const timeInterval = new Array(source.length).fill(0)

// const initVals = props.timeInterval.split(' ').map(Number)
// for (let i = 0; i < timeInterval.length; ++i) {
//   timeInterval[i] = i < initVals.length ? initVals[i] : 0
// }

// const emit = defineEmits(["send", "monitor"])

// const p = ref(0)

// const postAction = function(after) {
//   if (p.value >= source.length) {
//     return
//   }
//   emit("monitor",  sourceStr + timeInterval.join(' '))
//   if (!(after == 0 && timeInterval[p.value] == 0)) {
//     if (after != 0) {
//       timeInterval[p.value] -= after
//       postAction(0)
//     }
//     return
//   }
//   const action = new Uint8Array(5)
//   action[0] = 0xFF
//   action[1] = 0x09
//   action[2] = 0x00
//   action[3] = source[p.value] & 0xff
//   action[4] = (source[p.value] >> 8 ) & 0xff
//   emit("send", action)
//   p.value += 1
//   postAction(0)
// }
// // https://wit-motion.yuque.com/wumwnr/docs/gfrlph#Nix1r

// const calcNext = function(t) {
//   postAction(1)
//   t = t == undefined ? 2: t
//   if (t >= 0) {
//     let next = String(time.value[t] - 0 + 1)
//     if (next.length == 1) {
//       time.value[t] = '0' + next
//     } else if (next == (t == 0 ? '24' : '60')) {
//       time.value[t] = '00'
//       calcNext(t - 1)
//     } else {
//       time.value[t] = next
//     }
//   }
// }
</script>
<style scoped>
.wrap-container {
  width: 100%;
  height: 100%;
}
</style>
