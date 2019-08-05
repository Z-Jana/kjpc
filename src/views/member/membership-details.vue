<template>
  <div class="app-container">
    <el-tabs type="border-card">
      <el-tab-pane label="基本信息">
        <div class="filter-container">
          <el-button
            class="filter-item"
            style="margin-left: 10px;"
            type="primary"
            icon="el-icon-edit"
            @click="handleCreate"
          >添加会员</el-button>
          <!-- <el-select v-model="listQuery.importance" placeholder="加入时间" clearable style="width: 150px" class="filter-item">
							<el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
          </el-select>-->
          <el-input
            v-model="listQuery.title"
            placeholder="会员名称/姓名/手机号/id"
            style="width: 200px;"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
          <el-button
            v-waves
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="handleFilter"
          >查询</el-button>
        </div>
        <el-table
          :key="tableKey"
          v-loading="listLoading"
          :data="list"
          border
          fit
          highlight-current-row
          style="width: 100%;"
          @sort-change="sortChange"
        >
          <el-table-column
            label="序号"
            prop="id"
            align="center"
            width="80"
            :class-name="getSortClass('id')"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column label="会员" min-width="150px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.author }}</span>
            </template>
          </el-table-column>
          <el-table-column label="手机号" width="180px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.author }}</span>
            </template>
          </el-table-column>
          <el-table-column width="180px" align="center" label="加入时间">
            <template slot-scope="scope">
              <span>{{ scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </template>
          </el-table-column>
          <el-table-column width="150px" align="center" label="账户">
            <template slot-scope="scope">
              <span>余额：{{ scope.row.author }}</span>
              <br>
              积分：{{ scope.row.author }}
            </template>
          </el-table-column>
          <el-table-column width="150px" align="center" label="交易">
            <template slot-scope="scope">
              <span>订单：{{ scope.row.author }}</span>
              <br>
              金额：{{ scope.row.author }}
            </template>
          </el-table-column>
          <el-table-column label="实名" class-name="status-col" width="100">
            <template>
              <!-- slot-scope="{row}"<el-tag :type="row.status | statusFilter">
									{{ row.status }}
              </el-tag>-->
              <i class="el-icon-close iconclose" />
              <i class="el-icon-check iconcheck" />
            </template>
          </el-table-column>
          <el-table-column label="推荐人" width="110px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.author }}</span>
            </template>
          </el-table-column>
          <el-table-column label="下线人数" width="110px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.author }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="230"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="{row}">
              <el-button type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
              <el-button
                v-if="row.status!='deleted'"
                size="mini"
                type="danger"
                @click="handleModifyStatus(row,'deleted')"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="listQuery.page"
          :limit.sync="listQuery.limit"
          @pagination="getList"
        />
        <!-- 会员表单组件 -->
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
          <membershipForm />
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">关闭</el-button>
            <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">提交</el-button>
          </div>
        </el-dialog>
      </el-tab-pane>
      <!-- 交易信息 -->
      <el-tab-pane label="交易信息">
        <!-- 订单信息组件 -->
        <tradeInfo />
      </el-tab-pane>
      <!-- 账目信息 -->
      <el-tab-pane label="账目信息">
        <!-- 账目信息组件 -->
        <accountsInfo />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import {
  fetchList,
  createArticle,
  updateArticle
} from '@/api/article'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // 分页
import membershipForm from './components/membership-form'
import tradeInfo from './components/trade-info'
import accountsInfo from './components/accounts-info.vue'

export default {
  components: { Pagination, membershipForm, tradeInfo, accountsInfo },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
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
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
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
    // 删除
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
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
      // this.$nextTick(() => {
      //   this.$refs["dataForm"].clearValidate();
      // });
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
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
      // this.$nextTick(() => {
      //   this.$refs["dataForm"].clearValidate();
      // });
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
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
.iconclose {
  font: 20px bold;
  color: brown;
}
.iconcheck {
  font: 20px bold;
  color: green;
}
</style>

