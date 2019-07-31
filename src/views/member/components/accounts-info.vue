<template>
  <!-- <div class="app-container">
    <template >
      <div slot="left" class="slot-left">sss</div>
      <el-divider direction="vertical"></el-divider>
    </template>
    <template>
      <div slot="right" class="slot-right">sss</div>
    </template>
  </div> -->
  <el-container>
    <!-- 会员信息 -->
    <el-aside width="20%">
      <p>当前会员：<span class="redcolor">张三</span></p>
      <p>可用余额：<span class="redcolor">1000</span></p>
      <p>可用积分：<span class="redcolor">100</span></p>
      <el-button class="filter-item"  type="primary" icon="el-icon-edit" @click="handleCreate">
        调节会员账号
      </el-button>
    </el-aside>
    <!-- 列表 -->
    <el-main>
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
          >
            <template slot-scope="scope">
              <span>{{ scope.row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column width="180px" align="center" label="账户变动时间">
            <template slot-scope="scope">
              <span>{{ scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="账户变动原因" min-width="150px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.author }}</span>
            </template>
          </el-table-column>
          <el-table-column label="可用余额" width="180px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.author }}</span>
            </template>
          </el-table-column>
          <el-table-column label="可用积分" width="180px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.author }}</span>
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
    </el-main>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" label-position="right" label-width="100px" style="width: 400px; margin-left:50px;">

        <el-form-item class="label-left"  label="当前会员" prop="name" >
          <!-- <el-input v-model="temp.name" /> -->
          <span>张三</span>
        </el-form-item>
        <el-form-item label="账户变动原因" prop="timestamp">
          <el-input v-model="temp.remark"  type="textarea" :rows="3"/>
        </el-form-item>
        <el-form-item label="可用余额">
          <el-input v-model="temp.money" class="input-with-select" style="width:200px">
          <el-select v-model="moneytype" slot="prepend" placeholder="请选择">
            <el-option label="增加" value="0"/>
            <el-option label="减少" value="1"/>
          </el-select>
          </el-input>
            <span  class="huicolor">当前值:1000</span>
        </el-form-item>
        <el-form-item label="可用积分">
          <el-input v-model="temp.integral" class="input-with-select" style="width:200px">
          <el-select v-model="integraltype" slot="prepend" placeholder="请选择">
            <el-option label="增加" value="0"/>
            <el-option label="减少" value="1"/>
          </el-select>
          </el-input>
            <span  class="huicolor">当前值:100</span>
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
  </el-container>
  <!-- 调节会员账号表单 -->
    
</template>
<script>
import {
  fetchList,
  fetchPv,
  createArticle,
  updateArticle
} from "@/api/article";
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // 分页
export default {
  components: { Pagination },
  directives: { waves },
  data(){
    return{
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
        sort: "+id"
			},
			dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        name: '',
        money: '',
        integral: ''
      },
      moneytype:0,
      integraltype:0
    }
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items;
        this.total = response.data.total;

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    // 删除
    handleModifyStatus(row, status) {
      this.$message({
        message: "操作Success",
        type: "success"
      });
      row.status = status;
    },
    sortChange(data) {
      const { prop, order } = data;
      if (prop === "id") {
        this.sortByID(order);
      }
    },
		resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        name: '',
        money: '',
        integral:''
      }
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024; // mock a id
          this.temp.author = "vue-element-admin";
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp);
            this.dialogFormVisible = false;
            this.$notify({
              title: "Success",
              message: "Created Successfully",
              type: "success",
              duration: 2000
            });
          });
        }
      });
    },



  }
}
</script>
<style>
.el-aside {
    background-color: #fff;
    color: #333;
    min-height: 100%;
    border-right:1px solid #d7d7d7;
  }
  .redcolor{
    color:#D9001B;
  }
  .huicolor{
    color:#AAA
  }
  .el-select{
    width: 80px;
  }
  .slot-left{
    float: left;
    width: 20%;
    /* border-right:1px solid #ccc; */

  }
  .slot-right{
    float: right;
    width: 80%;
  }
</style>


