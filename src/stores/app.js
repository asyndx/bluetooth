import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAppSettings = defineStore('appSettings', () => {
  const codeGroups = ref(new Array(4))
  const codeIndex = ref(0)
  const initCodeGroups = function () {
    for (let i = 0; i < codeGroups.value.length; ++i) {
      codeGroups.value[i] = new Array(2).fill('')
    }
    codeIndex.value = 0
  }
  const isFull = function () {
    return codeIndex.value == codeGroups.value.length * codeGroups.value[0].length
  }
  const isEmpty = function () {
    return codeIndex.value == 0
  }
  const addCode = function (val) {
    if (isFull()) {
      return
    }
    codeGroups.value[parseInt(codeIndex.value / 2)][codeIndex.value % 2] = val
    codeIndex.value += 1
  }
  const delCode = function () {
    if (isEmpty()) {
      return
    }
    codeIndex.value -= 1
    codeGroups.value[parseInt(codeIndex.value / 2)][codeIndex.value % 2] = ''
  }
  const blurAferClick = function (e) {
    setTimeout(() => e.target.blur(), 100)
  }
  const debug = ref(false)

  const appStart = function () {
    console.log("app start")
  }

  const timeInterval = new Array(4).fill(0)
  const defalutTimeInterval = '0 20 20 20'
  const customTimeInterval = ref(defalutTimeInterval)
  const namePrefix = ref('One')
  const server = ref(null)
  const services = ref([])
  const characteristic = ref(null)
  const characteristics = ref([])
  const extServiceUUID = ref('')
  const uuidOfService = ref('')
  const uuidOfCharacteristic = ref('')
  const textData = ref('')
  const sendLogs = ref([])
  const connect = async function () {
    if (!server.value) {
      if (!navigator || !navigator.bluetooth) {
        ElMessage({
          message: "浏览器不支持Web Bluetooth API",
          type: "error",
        })
        return
      }
      try {
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
        server.value = await device.gatt.connect()
        services.value = await server.value.getPrimaryServices()
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
    }
  }

  const send = function (bytes) {
    if (bytes == undefined && textData.length) {
      const encoder = new TextEncoder()
      bytes = encoder.encode(textData.value)
    }
    if (server.value && characteristic.value) {
      sendLogs.value.push(Array.from(bytes).map(byte => '0x' + byte.toString(16).padStart(2, '0')).join(' '))
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

  const resetTimeInterval = function () {
    customTimeInterval.value = defalutTimeInterval
  }

  return { codeGroups, initCodeGroups, isFull, isEmpty, addCode, delCode,
    blurAferClick, debug, appStart, connect, disconnect, namePrefix,
    resetTimeInterval, server, services, characteristic, characteristics,
    extServiceUUID, uuidOfService, uuidOfCharacteristic, customTimeInterval,
    textData, send, sendLogs,
  }
})
