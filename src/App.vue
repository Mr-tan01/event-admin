<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useUseStore, useCountStore } from '@/stores'

//获取路由对象 router
//获取路由参数 route
const router = useRouter()
const route = useRoute()
const goList = () => {
  router.push('/list')
  console.log(route, router)
}

const userStore = useUseStore()
const countStore = useCountStore()
</script>

<template>
  <div>
    <router-view></router-view>

    <hr />
    <hr />
    <div>我是app</div>
    <el-button @click="$router.push('/home')">首页</el-button>
    <el-button @click="goList">列表</el-button>
    <el-button type="primary">Primary</el-button>
    <el-button type="success">Success</el-button>

    <p>{{ userStore.token }}</p>
    <el-button @click="userStore.setToken('sdsdsdsd')">登陆</el-button>
    <el-button @click="userStore.removeToken()">退出</el-button>
    <hr />
    {{ countStore.count }}
    <el-button @click="countStore.add(1)">加1</el-button>
  </div>
</template>

<style scoped></style>
