import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(persist)

export default pinia

//仓库统一导出
export * from './modules/user'
export * from './modules/counter'
