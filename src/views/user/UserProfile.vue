<script setup>
import { useUseStore } from '@/stores'
import { ref } from 'vue'
import { userUpdateInfoService } from '@/api/user'

// 从useUseStore中解构出user对象，并从中获取username、nickname、email、id属性
const {
  user: { username, nickname, email, id },
  getUser
} = useUseStore()

// 创建一个ref对象，用于存储用户信息
const userInfo = ref({ username, nickname, email, id })

// 定义表单验证规则
const rules = {
  nickname: [
    { required: true, message: '请输入用户昵称', trigger: 'blur' },
    {
      pattern: /^\S{2,10}$/,
      message: '昵称必须是2-10位的非空字符串',
      trigger: 'blur'
    }
  ],
  email: [
    { required: true, message: '请输入用户邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ]
}

// 创建一个ref对象，用于存储表单引用
const formRef = ref()
// 定义表单提交方法
const onSubmit = async () => {
  // 验证表单
  await formRef.value.validate()
  // 如果验证通过
  // 调用userUpdateInfoService方法，更新用户信息
  await userUpdateInfoService(userInfo.value)
  // 调用getUser方法，获取最新的用户信息
  await getUser()
  // 弹出成功提示
  ElMessage.success('修改成功')
}
</script>

<template>
  <page-container title="基本资料">
    <el-row>
      <el-col :span="12">
        <el-form
          :model="userInfo"
          :rules="rules"
          ref="formRef"
          label-width="100px"
          size="large"
        >
          <el-form-item label="登录名称">
            <el-input v-model="userInfo.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="用户昵称" prop="nickname">
            <el-input v-model="userInfo.nickname"></el-input>
          </el-form-item>
          <el-form-item label="用户邮箱" prop="email">
            <el-input v-model="userInfo.email"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">提交修改</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </page-container>
</template>
