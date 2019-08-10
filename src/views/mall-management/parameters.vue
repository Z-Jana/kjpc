<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加栏目
      </el-button>
    </div>
    <el-table
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <!-- v-loading="listLoading" -->
      <el-table-column label="序号" type="index" align="center" width="80" :class-name="getSortClass('id')">
        <!-- sortable="custom" -->
      </el-table-column>
      <el-table-column label="栏目名称" min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.column_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sort }}</span>
        </template>
      </el-table-column>
      <el-table-column label="显示方式" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.column_num }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品数" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.goods_num }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否显示" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-switch v-model="row.is_show" :active-value="1" :inactive-value="2" disabled />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="100px" style="width: 80% ; margin-left:50px;">

        <el-form-item label="栏目标题" prop="column_name">
          <el-input v-model="temp.column_name" />
        </el-form-item>
        <el-form-item label="栏目排序">
          <el-input v-model="temp.sort" type="number" :min="1" />
        </el-form-item>
        <el-form-item label="栏目图片">
          <el-upload
            class="upload-demo"
            action=""
            :limit="1"
            :multiple="true"
            :on-preview="handleImagePreview"
            :on-exceed="handleFileExceed"
            :on-change="handleCrwimgChange"
            :on-remove="handleCrwimgRemove"
            :file-list="ImageList"
            list-type="picture-card"
            :auto-upload="false"
          >
            <i class="el-icon-plus" />
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item label="栏目图片链接">
          <el-input v-model="temp.url" />
        </el-form-item>
        <el-form-item label="显示方式">
          <el-radio-group v-model="temp.column_num">
            <el-radio :label="1">
              一行1个
            </el-radio>
            <el-radio :label="2">
              一行2个
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否显示" class="field-label">
          <el-switch v-model="temp.is_show" active-value="1" inactive-value="2" />
        </el-form-item>
        <el-form-item label="选择商品" class="field-label">
          <el-button type="primary" @click="productData">
            商品内容
          </el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          关闭
        </el-button>
        <el-button type="primary" @click="createData()">
          提交
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="商品明细">
      <div class="filter-container">
        <el-select v-model="listQuery.importance" placeholder="商品分类" clearable style="width: 150px" class="filter-item">
          <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
        </el-select>
        <el-input v-model="listQuery.title" placeholder="商品名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          查询
        </el-button>
      </div>
      <el-table :data="proData" border fit highlight-current-row style="width: 100%">
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column prop="name" label="商品" />
        <el-table-column prop="price" label="商品价格" />
        <el-table-column prop="num" label="库存" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import { getToken } from '@/utils/auth'
import axios from 'axios'
import Pagination from '@/components/Pagination' // 分页组件
import { parametersPageApi } from '@/api/mall'

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: 'success',
        1: 'info'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      token: getToken(),
      pathurl: 'http://192.168.1.137:8050/',
      tableKey: 0,
      theme: false,
      // list: [{ name: '钻石专题', id: 1, pid: 1, type: 1, link: 'www.baidu.com', img: '', number: 1, status: 0 }, { name: '戒指专题', id: 2, pid: 2, type: 2, link: 'www.baidu.com', img: '', number: 2, status: 0 }, { name: '银饰专题', id: 3, pid: 3, type: 2, link: 'www.baidu.com', img: '', number: 2, status: 0 }],
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id',
        token: getToken()
      },

      temp: {
        token: getToken(),
        id: undefined,
        sort: 0,
        is_show: '1',
        column_name: '',
        goods_ids: '',
        column_num: 1,
        url: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      dialogPvVisible: false,
      proData: [{ name: '商品1', num: 1, price: 10 }, { name: '商品2', num: 10, price: 100 }],
      rules: {
        column_name: [{ required: true, message: '字段不能为空', trigger: 'blur' }]
      },
      dialogVisible: false,
      dialogImageUrl: '',
      ImageList: [],
      statusOptions: ['分类1', '分类2', '分类3']

    }
  },
  created() {
    this.getList()// 默认请求数据
  },
  methods: {
    getList() {
      this.listLoading = true
      parametersPageApi.getParametersPage(this.listQuery).then(response => {
        this.list = response.data.data
        this.total = response.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        token: getToken(),
        id: undefined,
        sort: 0,
        is_show: '1',
        column_name: '',
        goods_ids: '',
        column_num: 1,
        url: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.ImageList = []
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const formData = new FormData()
          formData.append('token', this.temp.token)
          formData.append('id', this.temp.id)
          formData.append('sort', this.temp.sort)
          formData.append('is_show', this.temp.is_show)
          formData.append('column_name', this.temp.column_name)
          formData.append('column_num', this.temp.column_num)
          formData.append('refresh_url', this.temp.refresh_url)
          formData.append('column_img_file', this.ImageList[0].raw)
          // console.log(formData)
          const config = {
            headers: { 'Content-Type': 'multipart/form-data' }
          }
          axios.post('/api/admin/GoodsColumn/save',
            formData, config
          ).then((res) => {
            console.log(res)
            if (res.status === 200) {
              this.dialogFormVisible = false
              this.getList()
              this.ImageList = []
              this.$notify({
                title: '成功',
                message: '保存成功',
                type: 'success',
                duration: 2000
              })
            }
          }).catch(err => {
            console.log('异常', err)
          })
        }
      })
    },
    handleUpdate(row) {
      this.ImageList.length = 0
      this.temp = Object.assign({}, row) // copy obj
      this.temp.is_show = row.is_show.toString()
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      if (this.temp.column_img !== '') {
        this.ImageList.push({ 'url': this.pathurl + this.temp.column_img })
      } else {
        this.ImageList.length = 0
      }
    },
    // 删除
    handleDelete(row) {
      const obj = {
        'ids': row.id,
        'token': getToken()
      }
      parametersPageApi.deleteParameters(obj).then(res => {
        if (res.code === 200) {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        } else {
          this.$notify.error({
            title: '失败',
            message: '删除失败'
          })
        }
        this.getList()
      })
    },
    // 图片上传
    handleCrwimgChange(file, fileList) {
      console.log(file, fileList)
      this.ImageList = fileList
    },
    handleCrwimgRemove(file, fileList) {
      this.ImageList = fileList
    },
    handleImagePreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleFileExceed(files, fileList) {
      this.$message.warning(`最大可上传一个文件！`)
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}`
        ? 'ascending'
        : sort === `-${key}`
          ? 'descending'
          : ''
    },
    // 选择商品
    productData() {
      this.dialogPvVisible = true
    }
  }
}
</script>
<style scoped>
.field-label{
  vertical-align: middle;
}
.upload-demo{
  float: left;
}
</style>

