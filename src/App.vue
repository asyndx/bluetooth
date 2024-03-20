<template>
  <router-view v-slot="{ Component }">
    <transition name="fade-slide" mode="out-in" appear v-on:send="send">
      <component :is="Component" />
    </transition>
  </router-view>
  <div :class="['bt-state', server ? 'access' : '']"></div>
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
      </div>
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
      <el-input v-model="data" placeholder="输入发送数据" style="width: 80%;" clearable></el-input>
    </div>
    <div class="console"> {{ output }} </div>
  </el-drawer>
</template>
<script setup>
import { ref, onUnmounted, computed } from 'vue'
import { Setting } from '@element-plus/icons-vue'
const showSetting = ref(false)

const namePrefix = ref('One')
const server = ref(null)
const services = ref([])
const characteristics = ref([])
const characteristic = ref(null)
const uuidOfService = ref('')
const uuidOfCharacteristic = ref('')

const connect = async function () {
  if (!server.value) {
    if (!navigator || !navigator.bluetooth) {
      alert("不支持")
      return
    }
    try {
      let device = null;
      if (namePrefix.value.length != 0) {
        device = await navigator.bluetooth.requestDevice({
          filters: [{ namePrefix: namePrefix.value }],
          optionalServices: ['0000fff0-0000-1000-8000-00805f9b34fb']
        })
      } else {
        device = await navigator.bluetooth.requestDevice({ acceptAllDevices: true })
      }
      ElMessage({
        message: "连接蓝牙设备" + device.name + "成功",
        type: "success",
      })
      server.value = await device.gatt.connect();
      services.value = await server.value.getPrimaryServices();
    } catch (err) {
      console.log(typeof err, err)
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
    characteristic.value.writeValueWithoutResponse(bytes)
  }
}

</script>
<style>
body {
  width: 100%;
  height: 100vh;
  margin: 0;
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
