<script setup>
import { ref } from 'vue'
import { Delete, Edit } from '@element-plus/icons-vue'
import ChannelSelecte from './components/ChannelSelect.vue'
import { artGetListService } from '@/api/article.js'
import { formatTime } from '@/utils/format.js'
import ArticleEdit from './components/ArticleEdit.vue'

//loading状态
const loading = ref(false)
//文章列表
const articleList = ref([])
//总条数
const total = ref(0)
//定义获取文章请求参数对象
const params = ref({
  pagenum: 1, // 当前页
  pagesize: 5, // 当前生效的每页条数
  cate_id: '',
  state: ''
})

//基于params参数获取文章列表
const getListService = async () => {
  loading.value = true //开启
  const res = await artGetListService(params.value)
  articleList.value = res.data.data
  total.value = res.data.total
  loading.value = false //关闭
}
getListService()

//添加事件
const articleEditRef = ref()
const onAddArticle = () => {
  articleEditRef.value.open({})
}
//编辑事件
const onEditArticle = (row) => {
  articleEditRef.value.open(row)
}
// 添加成功或者编辑成功的事件
const onSuccess = (type) => {
  if (type === 'add') {
    //如果是添加则渲染到最后一页去
    const lastPage = Math.ceil((total.value + 1) / params.value.pagesize) //获取总条数向上取整
    params.value.pagenum = lastPage
    getListService()
  }
  //如果是编辑则直接渲染到当前页面
  getListService()
}
//删除事件
const onDeleteArticle = async (row) => {
  //删除前提示
  await ElMessageBox.confirm('确定删除吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  await artDeleteService(row.id)
  //删除成功后重新渲染
  getListService()
}

//分页事件
const onSizeChange = (size) => {
  //每次从第一页渲染
  params.value.pagenum = 1
  params.value.pagesize = size
  //渲染数据
  getListService()
}
const onCurrentChange = (page) => {
  // 更新当前页
  params.value.pagenum = page
  //渲染数据
  getListService()
}

//搜素事件
const onSearch = () => {
  params.value.pagenum = 1 //重置页面
  getListService()
}
//重置事件
const onReset = () => {
  params.value.pagenum = 1 //重置页面
  //筛选条件清空
  params.value.cate_id = ''
  params.value.state = ''
  getListService()
}
</script>

<template>
  <PageContainer title="文章管理">
    <template #extra>
      <el-button type="primary" @click="onAddArticle">添加文章</el-button>
    </template>
    <!-- 表单区域 -->
    <!-- inline 在一行显示 -->
    <el-form inline>
      <el-form-item label="文章分类">
        <ChannelSelecte width="200px" v-model="params.cate_id"></ChannelSelecte>
      </el-form-item>
      <el-form-item label="发布状态">
        <el-select v-model="params.state" style="width: 200px">
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="onSearch" type="primary">搜素</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格区域 -->
    <el-table :data="articleList" v-loading="loading">
      <el-table-column label="文章标题" prop="title">
        <template #default="{ row }">
          <el-link type="primary" :underline="false">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="分类" prop="cate_name"></el-table-column>
      <el-table-column label="发表时间" prop="pub_date">
        <template #default="{ row }">
          {{ formatTime(row.pub_date) }}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="state"></el-table-column>
      <el-table-column label="操作">
        <!-- row获取当前行的数据 -->
        <template #default="{ row }">
          <el-button
            circle
            plain
            type="primary"
            :icon="Edit"
            @click="onEditArticle(row)"
          ></el-button>
          <el-button
            circle
            plain
            type="danger"
            :icon="Delete"
            @click="onDeleteArticle(row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页区域 -->
    <el-pagination
      v-model:current-page="params.pagenum"
      v-model:page-size="params.pagesize"
      :page-sizes="[2, 3, 5, 10]"
      :background="true"
      layout="jumper, total, sizes, prev, pager, next"
      :total="total"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      style="margin-top: 20px; justify-content: flex-start"
    />
    <!-- 抽屉区域 -->
    <ArticleEdit ref="articleEditRef" @success="onSuccess"></ArticleEdit>
  </PageContainer>
</template>

<style lang="scss" scoped></style>
