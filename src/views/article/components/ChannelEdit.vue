<script setup>
import { ref } from 'vue'
import {
  artAddChannelsService,
  artEditChannelsService,
  artDelChannelsService
} from '@/api/article.js'

const emit = defineEmits(['success'])
const formRef = ref()
const formModel = ref({
  cate_name: '',
  cate_alias: ''
})
//表单校验
const rules = {
  cate_name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    {
      pattern: /^\S{1,10}$/,
      message: '分类名必须是1-10位的非空字符',
      trigger: 'blur'
    }
  ],
  cate_alias: [
    { required: true, message: '请输入分类别名', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9]{1,10}$/,
      message: '分类别名必须是1~10位字母或数字',
      trigger: 'blur'
    }
  ]
}
//添加事件
const dialogVisible = ref(false)
const open = (row) => {
  dialogVisible.value = true
  formModel.value = { ...row } //添加(重置表单) 编辑(存储回显的数据)
}
//暴露方法
defineExpose({
  open
})

const onSubmit = async () => {
  await formRef.value.validate()
  //判断id是否存在 可知是添加状态还是编辑状态
  const isEdit = formModel.value.id
  if (isEdit) {
    await artEditChannelsService(formModel.value)
    ElMessage.success('编辑成功')
  } else {
    await artAddChannelsService(formModel.value)
    ElMessage.success('添加成功')
  }
  //处理成功后关闭弹层
  dialogVisible.value = false
  //子传父 通知父组件刷新页面
  emit('success')
}
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="formModel.id ? '编辑' : '添加'"
    width="30%"
  >
    <el-form
      ref="formRef"
      :model="formModel"
      :rules="rules"
      label-width="100px"
      style="padding-right: 30px"
    >
      <el-form-item label="分类名称" prop="cate_name">
        <el-input
          v-model="formModel.cate_name"
          placeholder="请输入分类名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="分类别名" prop="cate_alias">
        <el-input
          v-model="formModel.cate_alias"
          placeholder="请输入分类别名"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onSubmit"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
