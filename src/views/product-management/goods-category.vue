<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加分类
      </el-button>
    </div>
    <el-table
      :key="tableKey"

      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      :tree-props="{children: 'children'}"
      row-key="id"
      @sort-change="sortChange"
    >
      >
      <!-- v-loading="listLoading" -->
      <!-- <el-table-column label="序号" type="index" align="center" width="80" :class-name="getSortClass('id')" /> -->

      <el-table-column label="分类名称" min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sort_order }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品数量" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.number }}</span>
        </template>
      </el-table-column>

      <el-table-column label="是否显示" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-switch v-model="row.is_show" :active-value="1" :inactive-value="2" disabled />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" style="width:100px!important" size="mini" @click="handleNextCreate(row)">
            添加下级分类
          </el-button>
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
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="100px" style="width: 400px; margin-left:50px;">

        <el-form-item class="label-left" label="分类名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="分类排序" prop="sort_order">
          <el-input v-model="temp.sort_order" type="number" :min="0" />
        </el-form-item>

        <el-form-item label="是否显示">
          <el-switch v-model="temp.is_show" active-value="1" inactive-value="2" />
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

import waves from '@/directive/waves'
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination' // 分页
import { goodsCategoryPageApi } from '@/api/product'

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
      tableKey: 0,
      theme: false,
      // list: [{ name: '分类1', id: 1, number: 10, pid: 1, cat_group: 0, status: 0 }, { name: '分类2', id: 2, number: 100, pid: 2, cat_group: 0, status: 0, children: [{
      //   id: 31,
      //   number: '20',
      //   name: '分类1-1',
      //   pid: 31,
      //   cat_group: 1,
      //   status: 0
      // }, {
      //   id: 32,
      //   number: '202',
      //   name: '分类1-2',
      //   pid: 32,
      //   cat_group: 1,
      //   status: 0
      // }] },
      // { name: '分类3', id: 3, number: 20, pid: 3, cat_group: 0, status: 0 }],
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        sort: '+id',
        token: getToken()
      },
      temp: {
        token: getToken(),
        id: undefined,
        is_show: '1',
        sort_order: 0,
        parent_id: 0,
        name: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },

      rules: {
        name: [{ required: true, message: '字段不能为空', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()// 默认请求数据
  },
  methods: {
    getList() {
      this.listLoading = true
      goodsCategoryPageApi.getGoodsCategoryPage(this.listQuery).then(response => {
        console.log(response.data.data)
        this.list = response.data.data
        this.total = 3
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // 删除
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
        token: getToken(),
        id: undefined,
        is_show: '1',
        sort_order: 0,
        parent_id: 0,
        name: ''
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
    // 添加下级分类
    handleNextCreate(row) {
      // this.cat_group
      // if (row.cat_group + 1 > 2) {
      //   console.log('不能超过3级分类')
      //   return false
      // }
      this.resetTemp()
      // this.temp.cat_group = row.cat_group + 1
      this.temp.parent_id = row.id
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
          goodsCategoryPageApi.addUpdateGoodsCategory(this.temp).then((res) => {
            // // this.list.unshift(this.temp)
            // for (let i = 0; i < this.list.length; i++) {
            //   if (this.temp.cat_group == 2) {
            //     for (let j = 0; j < this.list[i].children.length; j++) {
            //       // this.list[i].children.unshift(this.temp)
            //       if (this.list[i].children[j].parent_id > 0) {
            //         console.log('11111')
            //       }
            //     }
            //   }
            // }
            console.log(res)
            if (res.status === 200) {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '保存成功',
                type: 'success',
                duration: 2000
              })
            }
          })
        }
      })
    },
    // 编辑
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
          goodsCategoryPageApi.addUpdateGoodsCategory(tempData).then(() => {
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

</style>

