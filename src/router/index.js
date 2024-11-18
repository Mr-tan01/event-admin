import { createRouter, createWebHistory } from 'vue-router'

//createRouter 创建路由实例
//配置history模式：
//1.history模式  createWebHistory 地址栏不带#
//2.hash模式  createWebHashHistory    地址栏带#

//import.meta.env.BASE_URL vite中的环境变量(在vite.config.js中配置base 基地址)
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: []
})

export default router
