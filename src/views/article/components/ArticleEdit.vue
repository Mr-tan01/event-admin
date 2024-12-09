<script setup>
import { ref } from 'vue'
import ChannelSelect from './ChannelSelect.vue'
import { Plus } from '@element-plus/icons-vue'
import {
  artPublishService,
  artGetDatailService,
  artEditService
} from '@/api/article'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { baseURL } from '@/utils/request'
import axios from 'axios'
import { ElMessage } from 'element-plus'

//默认数据
const defaultForm = {
  title: '',
  cate_id: '',
  content: '',
  cover_img: '',
  state: ''
}
//准备数据
const formModel = ref({
  ...defaultForm
})
//图片数据
const imgUrl = ref('')
const onSelectFile = (uploadFile) => {
  imgUrl.value = URL.createObjectURL(uploadFile.raw) //实现预览图片
  // 立刻将图片对象，存入 formModel.value.cover_img 将来用于提交
  formModel.value.cover_img = uploadFile.raw
}
//提交数据
const emit = defineEmits(['success'])
const onPublish = async (state) => {
  //将已发布或草稿状态，都存入
  formModel.value.state = state
  //接口需要formData对象
  //将普通对象转换为formData对象
  const fd = new FormData()
  for (let key in formModel.value) {
    fd.append(key, formModel.value[key])
  }

  //发请求(判断是添加操作还是编辑操作)
  if (formModel.value.id) {
    await artEditService(fd)
    ElMessage.success('修改成功')
    visibleDrawer.value = false
    //通知父组件修改成功
    emit('success', 'edit')
  } else {
    // 添加请求
    await artPublishService(fd)
    ElMessage.success('添加成功')
    visibleDrawer.value = false
    //通知父组件添加成功
    emit('success', 'add')
  }
}

const editorRef = ref()
const visibleDrawer = ref(false)
const open = async (row) => {
  visibleDrawer.value = true

  if (row.id) {
    //编辑
    //基于row.id发送请求，获取对应详情数据进行回显
    const res = await artGetDatailService(row.id)
    formModel.value = res.data.data
    //图片需要单独处理回显
    imgUrl.value = baseURL + formModel.value.cover_img
    //将网络图片地址转换为file对象
    const file = await getImageFile(imgUrl.value)
    formModel.value.cover_img = file
  } else {
    //重置数据
    formModel.value = {
      ...defaultForm
    }
    imgUrl.value = ''
    editorRef.value.setHTML('')
  }
}

//将网络图片地址转换为File对象函数
async function getImageFile(url) {
  try {
    // 使用axios发送get请求，获取图片文件
    const response = await axios.get(url, { responseType: 'blob' })
    // 将响应数据转换为Blob对象
    const blob = new Blob([response.data], { type: 'image/jpeg' })
    // 将Blob对象转换为File对象
    const file = new File([blob], 'image.jpg', { type: 'image/jpeg' })
    // 返回File对象
    return file
  } catch (error) {
    // 捕获错误并打印
    console.error(error)
  }
}

//向外暴露
defineExpose({
  open
})
</script>

<template>
  <el-drawer
    v-model="visibleDrawer"
    :title="formModel.id ? '编辑文章' : '添加文章'"
    direction="rtl"
    size="50%"
  >
    <!-- 发表文章表单 -->
    <el-form :model="formModel" ref="formRef" label-width="100px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formModel.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="文章分类" prop="cate_id">
        <channel-select
          v-model="formModel.cate_id"
          width="100%"
        ></channel-select>
      </el-form-item>
      <el-form-item label="文章封面" prop="cover_img">
        <!-- 关闭自动上传，进行本地预览图片即可 -->
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="onSelectFile"
        >
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <div class="editor">
          <quill-editor
            ref="editorRef"
            v-model:content="formModel.content"
            theme="snow"
            contentType="html"
          ></quill-editor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onPublish('已发布')">发布</el-button>
        <el-button type="info" @click="onPublish('草稿')">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}
.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
