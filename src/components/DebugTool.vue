<template>
  <div class="btn-setting" @click="showSetting = true">
    <el-icon><Setting /></el-icon>
  </div>
  <el-drawer title="蓝牙设置" v-model="showSetting" size="35%">
    <div class="setting-item">
      <span>蓝牙名称前缀：</span>
      <el-input v-model="namePrefix" placeholder="蓝牙名称前缀" style="width: 60%;" clearable></el-input>
    </div>
    <div class="setting-item">
      <span>操作：</span>
      <div style="display: flex;">
        <el-button @click="connect()" :disabled="server != null">连接</el-button>
        <el-button @click="disconnect()" :disabled="server == null">断开</el-button>
        <el-button @click="send()" :disabled="server == null">发送</el-button>
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
      <el-input v-model="textData" placeholder="输入发送数据（文本）" style="width: 80%;" clearable></el-input>
    </div>
    <div class="setting-item">
      <span>当前发送间隔：</span>
      <div>
        <el-input v-model="customTimeInterval " placeholder="发送间隔" style="width: 200px;" clearable></el-input>
        <el-button style="margin-left: 10px;" @click="resetTimeInterval()">重置</el-button>
      </div>
    </div>
  </el-drawer>
</template>
<script setup>
import { ref, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { Setting } from '@element-plus/icons-vue'
import { useAppSettings } from '@/stores/app'

const appSettings = useAppSettings()

const { connect, disconnect, resetTimeInterval, send } = appSettings
const { namePrefix, server, extServiceUUID, services, characteristics, characteristic, uuidOfService,
  uuidOfCharacteristic, customTimeInterval, textData, sendLogs } = storeToRefs(appSettings)

const showSetting = ref(false)

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

</script>
<style scoped>
.btn-setting {
  position: fixed;
  top: 10px;
  right: 10px;
  height: 48px;
  width: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 36px;
  color: white;
}
.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 32px;
  margin-bottom: 5px;
}
.app-console {
  width: 100%;
  background: rgb(49, 49, 48);
  color: white;
  white-space: pre-wrap;
  padding: 4px;
  border-radius: 4px;
  min-height: 200px;
}
</style>
