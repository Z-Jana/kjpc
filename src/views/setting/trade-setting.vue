<template>
  <div class="app-container">
    <div class="main">
      <div class="main-title">
        <div class="greenicon"></div>
        <div class="spantitle">自动关闭未付款订单</div>
      </div>
      <div class="inputbox">
        <label class="labeltext" >实物商品下单后</label>
        <el-input placeholder="请输入内容" v-model="temp.name" style="width:345px;">
          <template slot="append">小时</template>
        </el-input>
      </div>
			<div class="inputbox">
        <label class="labeltext">预定商品下单后</label>
        <el-input placeholder="请输入内容" v-model="temp.name" style="width:345px;">
          <template slot="append">小时</template>
        </el-input>
				<div class="smalltext">订单未付款，n小时后自动关闭，空为不自动关闭</div>
      </div>
    </div>
		<div class="main">
      <div class="main-title">
        <div class="greenicon"></div>
        <div class="spantitle">退款申请</div>
      </div>
      <div class="inputbox">
        <label class="labeltext" >完成订单几天后</label>
        <el-input placeholder="请输入内容" v-model="temp.name" style="width:345px;">
          <template slot="append">天</template>
        </el-input>
				<div class="smalltext">订单完成后，用户可在n天内发起退款申请，不填写默认0天不允许完成订单退款</div>
      </div>
    </div>
		<div class="main">
      <div class="main-title">
        <div class="greenicon"></div>
        <div class="spantitle">积分设置</div>
      </div>
      <div class="inputbox">
        <label class="labeltext" >多少积分兑换1元</label>
        <el-input placeholder="请输入内容" v-model="temp.name" style="width:345px;">
          <template slot="append">积分</template>
        </el-input>
				<span class="smalltext"> = 1</span>
      </div>
    </div>
		<div class="main">
      <div class="main-title">
        <div class="greenicon"></div>
        <div class="spantitle">推荐设置</div>
      </div>
      <div class="inputbox">
        <label class="labeltext" >注册赠送奖励</label>
        <el-input placeholder="请输入内容" v-model="temp.name" style="width:345px;">
          <template slot="append">积分</template>
        </el-input>
      </div>
			<div class="inputbox">
        <label class="labeltext">推荐好友奖励</label>
        <el-input placeholder="请输入内容" v-model="temp.name" style="width:345px;">
          <template slot="append">积分</template>
        </el-input>
      </div>
    </div>
		<div class="main">
      <div class="main-title">
        <div class="greenicon"></div>
        <div class="spantitle">库存扣减时机</div>
      </div>
			<div class="inputbox">
				<el-radio-group v-model="temp.pid">
            <el-radio :label="0">
              提交订单
            </el-radio>
            <el-radio :label="1">
              付款完成
            </el-radio>
          </el-radio-group>
			</div>
		</div>
		<div slot="footer" class="dialog-footer btnleft">
			<el-button type="primary" >
				确定
			</el-button>
		</div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      temp: {
        name: ""
      }
    };
  }
};
</script>

<style scoped>
.main {
  margin:20px 0 20px 50px;
}
.main-title {
  display: flex;
}
.greenicon {
  width: 5px;
  height: 18px;
  background: #00bfbf;
  margin: 0 5px;
}
.spantitle {
  font-size: 16px;
  font-family: "PingFangSC-Light", "PingFang SC Light", "PingFang SC";
}
.inputbox {
  /* display: inline-block; */
	/* float: left; */
  margin-left: 50px;
	padding: 10px;
}
.labeltext{
	margin-right: 10px;
	font-size: 14px;
	font-weight:200;
	/* width:300px; */
	/* text-align: left; */
}
.smalltext{
	margin: 5px 110px;
	font-size:13px;
}
.btnleft{
	margin-left: 20%;
}
</style>
