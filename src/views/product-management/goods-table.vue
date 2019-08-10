<template>
  <div class="app-container">
    <div class="filter-container">

      <el-select v-model="listQuery.importance" placeholder="预定商品" clearable style="width: 150px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery.type" placeholder="商品分类" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
      </el-select>
      <!-- <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select> -->
      <el-input v-model="listQuery.title" placeholder="商品名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加实物商品
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        仓库中
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        上架
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        下架
      </el-button>
      <!-- <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Export
      </el-button>
      <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        reviewer
      </el-checkbox> -->
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
      <el-table-column label="序号" prop="id" type="index" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <!-- <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template> -->
      </el-table-column>

      <el-table-column label="商品" min-width="150px">
        <template slot-scope="{row}">
          <img src="../../assets/images/logo.png" style="width:50px;height:50px;vertical-align: middle;">
          <span class="link-type" @click="handleUpdate(row)">{{ row.goods_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="价格" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="库存" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.store_count }}</span>
        </template>
      </el-table-column>
      <el-table-column label="销量" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品类型" width="110px" align="center">
        <template slot-scope="scope">
          <!-- <el-tag :type="scope.row.cat_id | cattypeFilter"> -->
          <span>{{ scope.row.cat_id | cattypeFilter }}</span>
          <!-- </el-tag> -->
        </template>
      </el-table-column>
      <!-- <el-table-column label="排序" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.is_on_sale }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="是否显示" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.is_on_sale | statusFilter">
            {{ row.is_on_sale | statusFilter }}
          </el-tag>
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

      <GoodsItem ref="goodsForm" :temp="temp" />

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          关闭
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          提交
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // 分页组件
import GoodsItem from './components/GoodsItem'
import { getToken } from '@/utils/auth'
import { goodsPageApi } from '@/api/product'

const calendarTypeOptions = [
  { key: '1', display_name: '商品分类1' },
  { key: '2', display_name: '商品分类2' },
  { key: '3', display_name: '商品分类3' },
  { key: '4', display_name: '商品分类4' }
]

export default {
  name: 'ComplexTable',
  components: { Pagination, GoodsItem },
  directives: { waves },
  filters: {
    cattypeFilter(type) {
      const cattype = {
        1: '预定商品',
        2: '实物商品',
        3: '积分商品'
      }
      return cattype[type]
    },
    statusFilter(status) {
      const statusMap = {
        1: '上架',
        2: '下架'
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
      importanceOptions: ['预定商品', '实物商品', '积分商品'],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        token: getToken(),
        goods_id: undefined,
        goods_name: '',
        price: 0,
        // is_free_shipping: 0,//是否免运费 0 免费 1邮递 2到付
        shipping_price: '',
        store_count: 0,
        cat_id: '',
        is_on_sale: 1,
        brand_id: 1, // 品牌,商品类型
        is_self_sufficiency: 1, // 自提
        gold_weight: '', // 金重
        predetermined_day: '', // 周期
        process_price: 0,
        damages_price_rate: 0,
        give_integral_rate: 0,
        first_integral_rate: 0,
        is_specs: 0,
        goods_content: '',
        goods_img_file: []
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      goodsPageApi.getGoodsPage(this.listQuery).then(response => {
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
        goods_id: undefined,
        goods_name: '',
        price: 0,
        // is_free_shipping: 0,//是否免运费 0 免费 1邮递 2到付
        shipping_price: '',
        store_count: 0,
        cat_id: '',
        is_on_sale: 0,
        brand_id: 0, // 品牌,商品类型
        is_self_sufficiency: 0, // 自提
        gold_weight: '', // 金重
        predetermined_day: '', // 周期
        process_price: 0,
        is_specs: 0
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      // this.$nextTick(() => {
      //   this.$refs['dataForm'].clearValidate()
      // })
    },
    createData() {
      // this.$refs['dataForm'].validate((valid) => {
      //   if (valid) {
      //     this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
      //     this.temp.author = 'vue-element-admin'
      //     createArticle(this.temp).then(() => {
      //       this.list.unshift(this.temp)
      //       this.dialogFormVisible = false
      //       this.$notify({
      //         title: 'Success',
      //         message: 'Created Successfully',
      //         type: 'success',
      //         duration: 2000
      //       })
      //     })
      //   }
      // })
      this.$refs['goodsForm'].goodsConfirm().then(res => {
        console.log('ok')
      }).catch(err => {
        if (err === 'valid') {
          console.log('valid')
        } else {
          console.log('1111')
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      // this.$nextTick(() => {
      //   this.$refs['dataForm'].clearValidate()
      // })
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
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
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
.link-type{
  /* vertical-align: middle; */
}
</style>
