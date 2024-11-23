<script setup>
import { ref } from 'vue'
import { artGetChannelsService, artDelChannelsService } from '@/api/article.js'
import { Edit, Delete } from '@element-plus/icons-vue'
import ChannelEdit from './components/ChannelEdit.vue'

const channelList = ref([])
const dialog = ref()
//loading加载
const loading = ref(false)
const getChannelList = async () => {
  //数据获取前进行加载动画
  loading.value = true

  const res = await artGetChannelsService()
  channelList.value = res.data.data
  //数据获取后取消加载动画
  loading.value = false
}
//一进页面立刻调用接口获取文章分类数据
getChannelList()

//添加事件
const onAddChannel = () => {
  dialog.value.open()
}
//编辑事件
const onEditChannel = (row) => {
  dialog.value.open(row)
}
//删除事件
const onDelChannel = async (row) => {
  await ElMessageBox.confirm('你确认要删除该分类吗', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
  await artDelChannelsService(row.id)
  ElMessage.success('删除成功')
  //重新渲染
  getChannelList()
}
//操作事件完成后重新获取文章分类数据
const onSuccess = () => {
  getChannelList()
}
</script>

<template>
  <PageContainer title="文章分类">
    <template #extra>
      <el-button @click="onAddChannel">添加分类</el-button>
    </template>
    <!-- 文章分类表格 -->
    <el-table v-loading="loading" :data="channelList" style="width: 100%">
      <el-table-column label="序号" type="index" width="100"></el-table-column>
      <el-table-column prop="cate_name" label="分类名称"></el-table-column>
      <el-table-column prop="cate_alias" label="分类别名"></el-table-column>
      <el-table-column label="操作" width="100">
        <!-- 作用域插槽 -->
        <!-- row:channelList的一项，$index:下标 -->
        <template #default="{ row, $index }">
          <el-button
            circle
            plain
            type="primary"
            :icon="Edit"
            @click="onEditChannel(row, $index)"
          ></el-button>
          <el-button
            circle
            plain
            type="danger"
            :icon="Delete"
            @click="onDelChannel(row, $index)"
          ></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据"></el-empty>
      </template>
    </el-table>
    <!-- 调用弹层组件 -->
    <ChannelEdit ref="dialog" @success="onSuccess"></ChannelEdit>
  </PageContainer>
</template>

<style lang="scss" scoped></style>
