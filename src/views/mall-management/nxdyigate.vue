<template>
  <div class="app-container">
    <div class="filter-container">

      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加导航图标
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
      <el-table-column label="序号" prop="id" type="index" align="center" width="80" :class-name="getSortClass('id')">
        <!-- sortable="custom" -->
      </el-table-column>

      <el-table-column label="导航图标名称" min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.title }}</span>
          <!-- <img style="width:35px;height:35px" src="../../assets/images/logo.png" /> -->
          <!-- <el-tag>{{ row.name }}
          </el-tag> -->
        </template>
      </el-table-column>

      <el-table-column label="排序" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.rank }}</span>
        </template>
      </el-table-column>
      <el-table-column label="链接" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.refresh_url }}</span>
        </template>
      </el-table-column>

      <el-table-column label="是否显示" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-switch v-model="row.status" :active-value="1" :inactive-value="2" disabled />
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
        <el-form-item label="导航标题" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item label="分类排序">
          <el-input v-model="temp.rank" type="number" :min="0" />
        </el-form-item>
        <el-form-item label="导航图标">
          建议尺寸:100 * 100 , 请将所有首页导航图片尺寸保持一致
          <el-upload
            class="upload-demo"
            action=""
            :limit="1"
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
        <el-form-item label="导航链接" prop="link">
          <el-input v-model="temp.refresh_url" />
        </el-form-item>

        <el-form-item label="是否显示">
          <el-switch v-model="temp.status" :active-value="1" :inactive-value="2" />
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
import { updateArticle } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import axios from 'axios'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { powerpointPageApi } from '@/api/mall'

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
      pathurl: 'http://192.168.1.137:8050/',
      token: '%2Ffzaw2ezV66RdDzjzNCpYpbNeewgcMtOy4%2BKLliH2zPnOT6T0T3ciWGxiIK6wCwNWbkjJaTYWLQ%3D',
      tableKey: 0,
      theme: false,
      // list: [{ name: '导航图标1', id: 1, pid: 1, link: 'www.baidu.com', img: '', status: 2 }, { name: '导航图标2', id: 2, pid: 2, link: 'www.baidu.com', img: '', status: 1 }, { name: '导航图标3', id: 3, pid: 3, link: 'www.baidu.com', img: '', status: 1 }],
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: 2,
        sort: '+id',
        token: '%2Ffzaw2ezV66RdDzjzNCpYpbNeewgcMtOy4%2BKLliH2zPnOT6T0T3ciWGxiIK6wCwNWbkjJaTYWLQ%3D'
      },

      temp: {
        adv_id: undefined,
        rank: 0,
        img_url: '',
        type: 3,
        status: '1',
        refresh_url: '',
        // img_url_file: [],
        token: '%2Ffzaw2ezV66RdDzjzNCpYpbNeewgcMtOy4%2BKLliH2zPnOT6T0T3ciWGxiIK6wCwNWbkjJaTYWLQ%3D'

      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      rules: {
        title: [{ required: true, message: '字段不能为空', trigger: 'blur' }]
      },
      downloadLoading: false,
      crwImageList: []
    }
  },
  created() {
    this.getList()// 默认请求数据
  },
  mounted() {
  },
  methods: {
    // 图片上传
    handleCrwimgChange(file, fileList) {
      console.log(file, fileList)
      this.crwImageList = fileList
    },
    handleCrwimgRemove(file, fileList) {
      this.crwImageList = fileList
    },
    handleImagePreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleFileExceed(files, fileList) {
      this.$message.warning(`最大可上传一个文件！`)
    },
    // 获取列表数据
    getList() {
      this.listLoading = true
      powerpointPageApi.getPowerpointPage(this.listQuery).then(response => {
        console.log(response.data)
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
        id: undefined,
        type: 2,
        status: '1',
        title: '',
        refresh_url: '',
        rank: 0,
        // img_url_file: '',
        token: this.token

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
          console.log(this.temp, 11111111)
          const formData = new FormData()
          formData.append('type', this.temp.type)
          formData.append('img_url_file', this.crwImageList[0].raw)
          formData.append('title', this.temp.title)
          formData.append('status', this.temp.status)
          formData.append('refresh_url', this.temp.refresh_url)
          formData.append('token', this.token)
          // console.log(formData)
          const config = {
            headers: { 'Content-Type': 'multipart/form-data' }
          }
          axios.post('/api/admin/Advertise/save',
            formData, config
          ).then((res) => {
            console.log(res)
            if (res.status === 200) {
              this.dialogFormVisible = false
              this.getList()
              this.crwImageList = []
              this.$notify({
                title: '成功',
                message: '创建成功',
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
    // 编辑操作
    handleUpdate(row) {
      this.crwImageList.length = 0
      this.temp = Object.assign({}, row) // copy obj
      // this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      if (this.temp.img_url != '') {
        this.crwImageList.push({ 'url': this.pathurl + this.temp.img_url })
      } else {
        this.crwImageList.length = 0
      }

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
    // 删除
    handleDelete(row) {
      // this.temp = Object.assign({}, row) // copy obj
      const obj = {

        ids: row.adv_id,
        token: this.token
      }
      console.log(obj)
      powerpointPageApi.delPowerpoint(obj).then(res => {
        console.log(res)

        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })
        this.getList()
      })
      // const index = this.list.indexOf(row)
      // this.list.splice(index, 1)
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

