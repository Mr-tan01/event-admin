import { ref } from 'vue'
import { defineStore } from 'pinia'
import { userGetInfoService } from '../../api/user'

//用户模块 token setToken removeToken
export const useUseStore = defineStore(
  'big-user',
  () => {
    //登录信息
    const token = ref('')
    const setToken = (newToken) => {
      token.value = newToken
    }
    const removeToken = () => {
      token.value = ''
    }

    //用户信息
    const user = ref({})
    const getUser = async () => {
      const res = await userGetInfoService() // 请求获取数据
      user.value = res.data.data
    }
    const setUser = (obj) => {
      user.value = obj
    }

    return {
      token,
      setToken,
      removeToken,
      user,
      getUser
    }
  },
  {
    //开启持久化
    persist: true
  }
)
