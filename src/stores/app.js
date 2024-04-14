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
  initCodeGroups()
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
  const blurTimers = {}
  const blurAfterClick = function (e, key) {
    if (blurTimers.hasOwnProperty(key)) {
      clearTimeout(blurTimers[key])
    }
    blurTimers[key] = setTimeout(() => {
      if (e && e.target && e.target.blur) {
        e.target.blur()
      }
      Reflect.deleteProperty(blurTimers, key)
    }, 150)
  }
  const debug = ref(false)

  const timeInterval = new Array(4).fill(0)
  const defalutTimeInterval = '0 20 20 20'
  const customTimeInterval = ref(defalutTimeInterval)
  const namePrefix = ref('One')
  const server = ref(null)
  const service = ref(null)
  const services = ref([])
  const characteristic = ref(null)
  const characteristics = ref([])
  const extServiceUUID = ref('')
  const uuidOfService = ref('')
  const uuidOfCharacteristic = ref('')
  const textData = ref('')
  const connect = async function () {
    if (!server.value) {
      if (!navigator || !navigator.bluetooth) {
        alert("浏览器不支持Web Bluetooth API")
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
        console.log("connect to '" + device.name + "' success.")
        server.value = await device.gatt.connect()
        console.log("get services...")
        services.value = await server.value.getPrimaryServices()
        console.log("get services success.")
      } catch (err) {
        if (err instanceof DOMException && err.message.includes('User cancelled')) {
          console.log("user cancelled!")
        } else {
          console.log(typeof err, err)
        }
      }
    }
  }

  const autoConnect = async () => {
    if (!server.value) {
      if (!navigator || !navigator.bluetooth) {
        alert("浏览器不支持Web Bluetooth API")
        throw "Unsupport Web Bluetooth API"
      }
      try {
        let device = await navigator.bluetooth.requestDevice({
          filters: [{ namePrefix: debug.value ? namePrefix.value : 'HC' }],
          optionalServices: [debug.value ? '0000fff0-0000-1000-8000-00805f9b34fb' : '0000ffe0-0000-1000-8000-00805f9b34fb'],
        })
        console.log("connect to '" + device.name + "' success.")
        server.value = await device.gatt.connect()
        service.value = await server.value.getPrimaryService(debug.value ? '0000fff0-0000-1000-8000-00805f9b34fb' : '0000ffe0-0000-1000-8000-00805f9b34fb')
        console.log("service: " + service.value.uuid)
        characteristic.value = await service.value.getCharacteristic(debug.value ? '0000fff2-0000-1000-8000-00805f9b34fb' : '0000ffe1-0000-1000-8000-00805f9b34fb')
        console.log("characteristic: " + characteristic.value.uuid)
        const action = new Uint8Array(5)
        action[0] = 0xFF
        action[1] = 0x09
        action[2] = 0x00
        action[3] = 0x00
        action[4] = 0x00
        send(action)
      } catch (err) {
        if (err instanceof DOMException && err.message.includes('User cancelled')) {
          console.log("user cancelled!")
        } else {
          console.log(typeof err, err)
        }
        throw "Unknown error"
      }
    }
  }

  const disconnect = function () {
    if (server.value) {
      server.value.disconnect()
      console.log("'" + server.value.device.name + "' disconnect.")
      server.value = null
      services.value = []
      characteristics.value = []
      uuidOfService.value = ''
      uuidOfCharacteristic.value = ''
    }
  }

  const send = function (bytes) {
    if (bytes == undefined && textData.value.length) {
      const encoder = new TextEncoder()
      bytes = encoder.encode(textData.value)
    }
    console.log("start send '" + Array.from(bytes).map(byte => '0x' + byte.toString(16).padStart(2, '0')).join(' ') + "'")
    if (server.value && characteristic.value) {
      try {
        characteristic.value.writeValueWithoutResponse(bytes).catch(err => {
          console.log("error2!", err)
        })
        console.log("send success!")
      } catch (e) {
        console.log("error!", e)
      }
    } else if (server.value == null) {
      console.log("error: server is null!")
    } else {
      console.log("error: characteristic is null!")
    }
  }

  const resetTimeInterval = function () {
    customTimeInterval.value = defalutTimeInterval
  }

  const queue = ref(null)
  const worker = ref(null)

  const initQueue = function () {
    const msgWithTimeList = codeGroups.value.map((val, idx) => {
      const action = new Uint8Array(5)
      action[0] = 0xFF
      action[1] = 0x09
      action[2] = 0x00
      const code = val[0] + val[1]
      const target = (idx % 2) * 4 + parseInt(code.length != 2 ? '0' : code, 2) + 1
      action[3] = target & 0xff
      action[4] = (target >> 8 ) & 0xff
      return [action, timeInterval[idx]]
    })
    for (let ext of [[2, 14, 20], [5, 15, 20]]) {
      const action = new Uint8Array(5)
      action[0] = 0xFF
      action[1] = 0x09
      action[2] = 0x00
      action[3] = ext[1] & 0xff
      action[4] = (ext[1] >> 8 ) & 0xff
      msgWithTimeList.splice(ext[0], 0, [action, ext[2]])
    }
    msgWithTimeList[3][1] = 3
    return msgWithTimeList
  }

  const createTask = function (msgWithtime) {
    return setTimeout(msg => {
      send(msg)
      if (queue.value.length) {
        worker.value = createTask(queue.value.shift())
      } else {
        worker.value = null
      }
    }, msgWithtime[1] * 1000, msgWithtime[0])
  }

  const appStart = function () {
    const initVals = customTimeInterval.value.split(' ').map(Number)
    for (let i = 0; i < timeInterval.length; ++i) {
      timeInterval[i] = i < initVals.length ? initVals[i] : 0
    }
    queue.value = initQueue()
    worker.value = createTask(queue.value.shift())
  }

  return { codeGroups, initCodeGroups, isFull, isEmpty, addCode, delCode,
    blurAfterClick, debug, appStart, connect, disconnect, namePrefix,
    resetTimeInterval, server, services, characteristic, characteristics,
    extServiceUUID, uuidOfService, uuidOfCharacteristic, customTimeInterval,
    textData, send, worker, codeIndex, autoConnect,
  }
})
