<template>
  <div class="app-container">
    <div class="filter-container">

      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加幻灯片
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
      <el-table-column label="ID" prop="id" align="center" width="80" :class-name="getSortClass('id')">
        <!-- sortable="custom" -->
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="幻灯片名称" min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.name }}</span>
          <!-- <img style="width:35px;height:35px" src="../../assets/images/logo.png" /> -->
          <!-- <el-tag>{{ row.name }}
          </el-tag> -->
        </template>
      </el-table-column>
      <!-- <el-table-column label="排序" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.pid }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="链接" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.link }}</span>
        </template>
      </el-table-column>

      <el-table-column label="是否显示" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-switch v-model="row.status" />

        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>

          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleModifyStatus(row,'deleted')">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="100px" style="width: 80% ; margin-left:50px;">
        <el-form-item label="幻灯片标题" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item label="分类排序" prop="timestamp">
          <el-input v-model="temp.pid" type="number" />
        </el-form-item>
        <el-form-item label="幻灯片图片">
          <el-upload
            class="upload-demo"
            action=""
            :limit="10"
            :multiple="true"
            :on-preview="handleImagePreview"
            :on-exceed="handleFileExceed"
            :on-change="handleCrwimgChange"
            :on-remove="handleCrwimgRemove"
            :file-list="crwImageList"
            list-type="picture-card"
            :auto-upload="false"
          >
            <!-- :disabled="temp.status == 0 ? false: true" -->
            <!-- <el-button v-show="temp.status == 0" slot="trigger" size="small" type="primary">新增图片</el-button> -->
            <i class="el-icon-plus" />
          <!-- <el-button v-show="temp.status == 0" style="margin-left: 10px;" size="small" type="success" @click="submitCrwimg">上传图片</el-button> -->
          <!--div slot="tip" class="el-upload__tip" v-show="temp.status == 0">只能上传 jpg 或 png 文件，且不超过 2 MB</div-->
          </el-upload>
        </el-form-item>
        <el-form-item label="幻灯片链接" prop="link">
          <el-input v-model="temp.link" />
        </el-form-item>

        <el-form-item label="是否显示">
          <el-switch v-model="temp.status" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          关闭
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          提交
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchList, createArticle, updateArticle } from '@/api/article'
import waves from '@/directive/waves' // waves directive
// import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

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
    // typeFilter(type) {
    //   return calendarTypeKeyValue[type]
    // }
  },
  data() {
    return {
      tableKey: 0,
      theme: false,
      list: [{ name: '幻灯片1', id: 1, pid: 1, link: 'www.baidu.com', img: '', status: 0 }, { name: '幻灯片2', id: 2, pid: 2, link: 'www.baidu.com', img: '', status: 0 }, { name: '幻灯片3', id: 3, pid: 3, link: 'www.baidu.com', img: '', status: 0 }],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },

      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false,
      crwImageList: []
    }
  },
  created() {
    // this.getList()//默认请求数据
  },
  methods: {
    // 图片上传
    handleCrwimgChange(file, fileList) {
      this.crwImageList = fileList
    },
    handleCrwimgRemove(file, fileList) {
      this.crwImageList = fileList
    },
    handleImagePreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handlePdfPreview(file) {
      window.open(file.url)
    },
    handleFileExceed(files, fileList) {
      this.$message.warning(`最大可上传十个文件！`)
    },
    //
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
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
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}`
        ? 'ascending'
        : sort === `-${key}`
          ? 'descending'
          : ''
    }
  }
}
</script>
<style scoped>
.upload-demo{
  float: left;
}

</style>

