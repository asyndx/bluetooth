<template>
  <BackGround />
  <router-view v-slot="{ Component }">
    <transition name="fade-slide" mode="out-in" appear @send="send" :characteristic="characteristic" :timeInterval="timeInterval" @monitor="monitor">
      <component :is="Component" />
    </transition>
  </router-view>
  <div :class="['bt-state', server ? 'access' : '']"></div>
  <div class="btn-fullscreen" @click="toggle">
    <svg width="1em" height="1em" fill="currentColor" viewBox="64 64 896 896">
      <path
        d="M290 236.4l43.9-43.9a8.01 8.01 0 00-4.7-13.6L169 160c-5.1-.6-9.5 3.7-8.9 8.9L179 329.1c.8 6.6 8.9 9.4 13.6 4.7l43.7-43.7L370 423.7c3.1 3.1 8.2 3.1 11.3 0l42.4-42.3c3.1-3.1 3.1-8.2 0-11.3L290 236.4zm352.7 187.3c3.1 3.1 8.2 3.1 11.3 0l133.7-133.6 43.7 43.7a8.01 8.01 0 0013.6-4.7L863.9 169c.6-5.1-3.7-9.5-8.9-8.9L694.8 179c-6.6.8-9.4 8.9-4.7 13.6l43.9 43.9L600.3 370a8.03 8.03 0 000 11.3l42.4 42.4zM845 694.9c-.8-6.6-8.9-9.4-13.6-4.7l-43.7 43.7L654 600.3a8.03 8.03 0 00-11.3 0l-42.4 42.3a8.03 8.03 0 000 11.3L734 787.6l-43.9 43.9a8.01 8.01 0 004.7 13.6L855 864c5.1.6 9.5-3.7 8.9-8.9L845 694.9zm-463.7-94.6a8.03 8.03 0 00-11.3 0L236.3 733.9l-43.7-43.7a8.01 8.01 0 00-13.6 4.7L160.1 855c-.6 5.1 3.7 9.5 8.9 8.9L329.2 845c6.6-.8 9.4-8.9 4.7-13.6L290 787.6 423.7 654c3.1-3.1 3.1-8.2 0-11.3l-42.4-42.4z"></path>
    </svg>
  </div>
  <div class="btn-setting" @click="showSetting = true">
    <el-icon><Setting /></el-icon>
  </div>
  <el-drawer title="蓝牙设置" v-model="showSetting" size="45%">
    <div class="setting-item">
      <span>蓝牙名称前缀：</span>
      <el-input v-model="namePrefix" placeholder="蓝牙名称前缀" style="width: 60%;" clearable></el-input>
    </div>
    <div class="setting-item">
      <span>操作：</span>
      <div style="display: flex;">
        <el-button @click="connect">连接</el-button>
        <el-button @click="disconnect">断开</el-button>
        <el-button @click="send">发送</el-button>
        <el-button @click="clear">清空</el-button>
      </div>
    </div>
    <div class="setting-item">
      <span></span>
      <el-input v-model="extServiceUUID" placeholder="额外服务UUID" style="width: 80%;" clearable></el-input>
    </div>
    <div class="setting-item">
      <span>服务：</span>
      <el-select v-model="uuidOfService" placeholder="" style="width: 80%;" @change="handleServiceChange">
        <el-option
          v-for="item in services"
          :key="item.uuid"
          :label="item.uuid"
          :value="item.uuid"
        />
      </el-select>
    </div>
    <div class="setting-item">
      <span>特征值：</span>
      <el-select v-model="uuidOfCharacteristic" placeholder="" style="width: 80%;" @change="handleCharacteristicChange">
        <el-option
          v-for="item in characteristics"
          :key="item.uuid"
          :label="item.uuid"
          :value="item.uuid"
        />
      </el-select>
    </div>
    <div class="setting-item">
      <span>发送数据：</span>
      <el-input v-model="data" placeholder="输入发送数据（文本）" style="width: 80%;" clearable></el-input>
    </div>
    <div class="setting-item">
      <span>使用固定间隔：</span>
      <div>
        <el-switch v-model="useFixedInterval" style="margin-right: 10px;" @change="handleUseFixed" />
        <el-input-number v-model="fixedInterval" :min="0" @change="handleFixedIntervalChange" :disabled="!useFixedInterval" />
      </div>
    </div>
    <div class="setting-item">
      <span>当前发送间隔：</span>
      <div>
        <el-input v-model="timeInterval" placeholder="发送间隔" style="width: 200px;" :disabled="useFixedInterval" clearable></el-input>
        <el-button style="margin-left: 10px;" @click="reset" :disabled="useFixedInterval">重置</el-button>
      </div>
    </div>
    <div class="setting-item" style="height: 32px; white-space: pre-wrap;">
      <span>{{ runInfo }}</span>
    </div>
    <div class="console"> {{ output }} </div>
  </el-drawer>
</template>
<script setup>
import BackGround from '@/components/BackGround.vue'
import { ref, onUnmounted, computed, onMounted } from 'vue'
import { Setting } from '@element-plus/icons-vue'
import router from './router'
import { useFullscreen } from '@vueuse/core'

const { toggle } = useFullscreen()
const showSetting = ref(false)

const namePrefix = ref('BLE')
const server = ref(null)
const extServiceUUID = ref('')
const services = ref([])
const characteristics = ref([])
const characteristic = ref(null)
const uuidOfService = ref('')
const uuidOfCharacteristic = ref('')
const timeInterval = ref('0 20 20 20 1 20 20 20')
const useFixedInterval = ref(false)
const fixedInterval = ref(5)

const connect = async function () {
  if (!server.value) {
    if (!navigator || !navigator.bluetooth) {
      alert("不支持")
      return
    }
    try {
      await navigator.bluetooth.getAvailability()
      let device = null
      const optionalServices = ref([
        '0000ffe0-0000-1000-8000-00805f9b34fb',
        '0000fff0-0000-1000-8000-00805f9b34fb', // APP
        '0000fee0-0000-1000-8000-00805f9b34fb', // BLE
      ])
      if (extServiceUUID.value.length != 0) {
        optionalServices.value.push(extServiceUUID.value)
      }
      if (namePrefix.value.length != 0) {
        device = await navigator.bluetooth.requestDevice({
          filters: [{ namePrefix: namePrefix.value }],
          optionalServices: optionalServices.value,
        })
      } else {
        device = await navigator.bluetooth.requestDevice({
          acceptAllDevices: true,
          optionalServices: optionalServices.value,
        })
      }
      ElMessage({
        message: "连接蓝牙设备" + device.name + "成功",
        type: "success",
      })
      server.value = await device.gatt.connect();
      services.value = await server.value.getPrimaryServices();
    } catch (err) {
      if (err instanceof DOMException && err.message.includes('User cancelled')) {
        ElMessage("取消连接")
      } else {
        console.log(typeof err, err)
      }
    }
  }
}

const disconnect = function () {
  if (server.value) {
    server.value.disconnect()
    ElMessage({
      message: "断开蓝牙设备" + server.value.device.name + "成功",
      type: "success",
    })
    server.value = null
    services.value = []
    characteristics.value = []
    uuidOfService.value = ''
    uuidOfCharacteristic.value = ''
  } else {
    ElMessage({
      message: "未连接",
      type: "warning",
    })
  }
}

onUnmounted(() => {
  disconnect()
})

const handleServiceChange = function (val) {
  const service = services.value.find(item => item.uuid == val)
  if (service) {
    service.getCharacteristics().then(res => {
      characteristics.value = res
      uuidOfCharacteristic.value = ''
    }).catch(err => {
      console.log(err)
    })
  }
}

const handleCharacteristicChange = function (val) {
  characteristic.value = characteristics.value.find(item => item.uuid == val)
}

const data = ref('')

const out = ref([])

const output = computed(() => {
  return out.value.join('\n')
})

const send = function (bytes) {
  if (bytes instanceof PointerEvent) {
    const encoder = new TextEncoder()
    bytes = encoder.encode(data.value)
  }
  if (server.value && characteristic.value) {
    out.value.push(Array.from(bytes).map(byte => '0x' + byte.toString(16).padStart(2, '0')).join(' '))
    try {
      characteristic.value.writeValueWithoutResponse(bytes)
    } catch (e) {
      console.log(typeof e)
      console.log(e)
      console.log(String(e))
    }
  } else if (server.value == null) {
    ElMessage({
      message: "未连接",
      type: "warning",
    })
  } else {
    ElMessage({
      message: "未选择特征值",
      type: "warning",
    })
  }
}

const clear = function () {
  out.value = []
}

const reset = function () {
  timeInterval.value = '0 20 20 20 1 20 20 20'
}

const timeIntervalBak = ref(timeInterval.value)

const handleUseFixed = function (useFixed) {
  if (useFixed) {
    timeIntervalBak.value = timeInterval.value
    timeInterval.value = new Array(8).fill(fixedInterval.value).join(' ')
  } else {
    timeInterval.value = timeIntervalBak.value
  }
}

const handleFixedIntervalChange = function (value) {
  if (useFixedInterval.value) {
    timeInterval.value = new Array(8).fill(value).join(' ')
  }
}

const runInfo = ref('')

router.afterEach((to, from, failure) => {
  if (to.path == '/') {
    runInfo.value = ''
  }
})

const monitor = function (newInfo) {
  runInfo.value = newInfo
}

</script>
<style>
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
.bt-state {
  position: fixed;
  top: 10px;
  left: 10px;
  height: 36px;
  width: 36px;
  background: red;
  border-radius: 50%;
}
.access {
  background: green;
}
.btn-setting {
  position: fixed;
  top: 10px;
  right: 10px;
  height: 36px;
  width: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid black;
}
.btn-fullscreen {
  position: fixed;
  top: 10px;
  right: 56px;
  height: 36px;
  width: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid black;
}
.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 32px;
  margin-bottom: 5px;
}
.console {
  width: 100%;
  background: rgb(49, 49, 48);
  color: white;
  white-space: pre-wrap;
  padding: 4px;
  border-radius: 4px;
  min-height: 200px;
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
