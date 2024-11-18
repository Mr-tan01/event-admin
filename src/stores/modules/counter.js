import { ref } from 'vue'
import { defineStore } from 'pinia'

//数字计数器模块
export const useCountStore = defineStore('big-count', () => {
  const count = ref(100)
  const add = (newCount) => {
    count.value += newCount
  }
  return {
    count,
    add
  }
})
