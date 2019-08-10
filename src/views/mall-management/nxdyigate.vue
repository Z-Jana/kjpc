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
      <el-table-column label="序号" type="index" align="center" width="80" :class-name="getSortClass('id')" />

      <el-table-column label="导航图标名称" min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.title }}</span>
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
          <div>建议尺寸:100 * 100 , 请将所有首页导航图片尺寸保持一致</div>
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
        <el-form-item label="导航链接" prop="link">
          <el-input v-model="temp.refresh_url" />
        </el-form-item>

        <el-form-item label="是否显示">
          <el-switch v-model="temp.status" active-value="1" inactive-value="2" />
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

  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import { getToken } from '@/utils/auth'
import axios from 'axios'
import Pagination from '@/components/Pagination' // 分页组件
import { powerpointPageApi } from '@/api/mall'

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      pathurl: 'http://192.168.1.137:8050/',
      token: getToken(),
      tableKey: 0,
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
        token: getToken()
      },
      temp: {
        adv_id: undefined,
        rank: 0,
        img_url: '',
        type: 3,
        status: '1',
        refresh_url: '',
        // img_url_file: [],
        token: getToken()
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
      dialogVisible: false,
      dialogImageUrl: '',
      ImageList: []
    }
  },
  created() {
    this.getList()// 默认请求数据
  },
  mounted() {
  },
  methods: {
    // 获取列表数据
    getList() {
      this.listLoading = true
      powerpointPageApi.getPowerpointPage(this.listQuery).then(response => {
        console.log(response)
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
        token: getToken()

      }
    },
    // 新增操作
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
          console.log(this.temp, 11111111)
          const formData = new FormData()
          formData.append('token', this.temp.token)
          formData.append('adv_id', this.temp.adv_id)
          formData.append('type', this.temp.type)
          formData.append('title', this.temp.title)
          formData.append('status', this.temp.status)
          formData.append('refresh_url', this.temp.refresh_url)
          formData.append('img_url_file', this.ImageList[0].raw)
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
    // 编辑操作
    handleUpdate(row) {
      this.ImageList.length = 0
      this.temp = Object.assign({}, row) // copy obj
      this.temp.status = row.status.toString()
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      if (this.temp.img_url !== '') {
        this.ImageList.push({ 'url': this.pathurl + this.temp.img_url })
      } else {
        this.ImageList.length = 0
      }

      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    // 删除
    handleDelete(row) {
      const obj = {
        'ids': row.adv_id,
        'token': this.token
      }
      powerpointPageApi.delPowerpoint(obj).then(res => {
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
    }
  }
}
</script>
<style scoped>
.upload-demo{
  float: left;
}

</style>

