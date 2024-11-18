import axios from 'axios'
import { useUseStore } from '@/stores'
import router from '@/router'
import { ElMessage } from 'element-puls'
const baseURL = 'http://big-event-vue-api-t.itheima.net'

const instance = axios.create({
  // TODO 1. 基础地址，超时时间
  baseURL,
  timeout: 1000
})

//请求拦截器
instance.interceptors.request.use(
  (config) => {
    // TODO 2. 携带token
    const useStore = useUseStore
    if (useStore.token) {
      config.headers.Authorization = useStore.token
    }
    return config
  },
  (err) => Promise.reject(err)
)

//响应拦截器
instance.interceptors.response.use(
  (res) => {
    //成功
    // TODO 3. 摘取核心响应数据
    if (res.data.code === 0) {
      return res
    }
    // TODO 4. 处理业务失败,给出错误提示
    ElMessage.error(res.data.message || '服务异常')
    return Promise.reject(res.data)
  },
  (err) => {
    // TODO 5. 处理错误
    //  1.401错误 （权限不足||token过期）=》拦截到登陆
    //  状态码
    if (err.response?.status === 401) {
      router.push('./login')
    }

    //  2.错误默认情况
    ElMessage.error(err.response.data.message || '服务异常')
    return Promise.reject(err)
  }
)

export default instance
export { baseURL }
