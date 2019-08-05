<template>
  <div class="app-container">
    <tradeInfo />
    <el-button type="primary" @click="receiveClick('create')">发货</el-button>
    <el-button type="primary" @click="receiveClick('select')">查看物流</el-button>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <receivingInfo />
      <div v-if="dialogStatus=='create'" class="materdetail">
        <p>
          <label>选择物流公司</label>
          <el-select v-model="express" style="width: 200px">
            <el-option value="中通快递">中通快递</el-option>
            <el-option value="申通快递">申通快递</el-option>
            <el-option value="顺丰快递">顺丰快递</el-option>
            <el-option value="圆通快递">圆通快递</el-option>
          </el-select>
        </p>
        <p>
          <label>填写发货单号</label>
          <el-input v-model="number" placeholder="请输入内容" style="width:200px" />
        </p>
      </div>
      <div v-else class="seldetail">
        <span>物流公司：中通快递</span>
        <span>物流单号：7627489374892749</span>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">关闭</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary">确认发货</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import tradeInfo from '../member/components/trade-info'
import receivingInfo from './components/receiving-info'
export default {
  components: { tradeInfo, receivingInfo },
  data() {
    return {
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        select: '查看物流',
        create: '物流发货'
      },
      express: '顺丰快递',
      number: ''
    }
  },
  methods: {
    receiveClick(type) {
      this.dialogStatus = type
      this.dialogFormVisible = true
    }
  }

}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.materdetail{
  text-align: center;
}
.seldetail{
  margin-left: 20px;
  span{
    padding-right:50px;
    font-size: 14px;
  }
}
</style>

