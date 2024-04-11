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
  return { codeGroups, initCodeGroups, isFull, isEmpty, addCode, delCode, blurAferClick, debug, appStart }
})
