<script setup>
import { ref } from 'vue'
import PageContainer from '@/components/PageContainer.vue'
import { userUpdatePassService } from '@/api/user'
import { useUseStore } from '@/stores'
import { useRouter } from 'vue-router'

const pwdFormRef = ref()
// 表单绑定字段
const pwdForm = ref({
  old_pwd: '',
  new_pwd: '',
  re_pwd: ''
})

// 自定义校验要在校验规则前面才能被找到
// 自定义校验1：原密码 和 新密码不能一样
const validateNewPwd = (rule, value, callback) => {
  if (pwdForm.value.old_pwd === value) {
    callback(new Error('新密码不能与原密码相同'))
  } else {
    callback()
  }
}
// 自定义校验2：新密码 和 确认密码必须一样
const validateRePwd = (rule, value, callback) => {
  if (value !== pwdForm.value.new_pwd) {
    callback(new Error('两次输入的新密码不一致'))
  } else {
    callback()
  }
}

// 校验规则
const rules = {
  old_pwd: [
    { required: true, message: '请输入原密码', trigger: 'blur' },
    { min: 6, max: 15, message: '密码长度在 6 到 15 个字符', trigger: 'blur' }
  ],
  new_pwd: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 15, message: '密码长度在 6 到 15 个字符', trigger: 'blur' },
    { validator: validateNewPwd, trigger: 'blur' }
  ],
  re_pwd: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    { min: 6, max: 15, message: '密码长度在 6 到 15 个字符', trigger: 'blur' },
    { validator: validateRePwd, trigger: 'blur' }
  ]
}

// 提交表单
const userStore = useUseStore()
const router = useRouter()
const submitForm = async () => {
  await pwdFormRef.value.validate()
  await userUpdatePassService(pwdForm.value)
    .then(() => {
      ElMessage.success('修改密码成功')
      // 重置表单
      userStore.setToken('')
      userStore.setUser({})
      //跳转登录页
      router.push('/login')
    })
    .catch((err) => {
      ElMessage.error(err.message)
    })
}

// 重置表单
const resetForm = () => {
  //用于重置表单字段。调用这个方法时，表单中的所有字段都会被重置为初始值。
  pwdFormRef.value.resetFields()
}
</script>

<template>
  <page-container title="修改密码">
    <el-row>
      <el-col :span="12">
        <el-form
          :model="pwdForm"
          :rules="rules"
          ref="pwdFormRef"
          label-width="100px"
        >
          <el-form-item label="原密码" prop="old_pwd">
            <el-input
              v-model="pwdForm.old_pwd"
              type="password"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="new_pwd">
            <el-input
              v-model="pwdForm.new_pwd"
              type="password"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="re_pwd">
            <el-input
              v-model="pwdForm.re_pwd"
              type="password"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm">修改密码</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </page-container>
</template>
