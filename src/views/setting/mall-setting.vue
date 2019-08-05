<template>
  <div class="app-container">
    <el-form ref="dataForm" :model="temp" label-position="right" label-width="200px" style="width: 500px; margin-left:50px;">
      <el-form-item label="商城名称" prop="name">
        <el-input v-model="temp.name" />
      </el-form-item>
      <el-form-item label="商城logo" />
      <el-form-item label="商城简介">
        <el-input v-model="temp.phone" type="textarea" />
      </el-form-item>
      <el-form-item label="退货地址" prop="address">
        <el-input v-model="temp.address" />
      </el-form-item>
      <el-form-item label="联系人" prop="relation">
        <el-input v-model="temp.relation" />
      </el-form-item>
      <el-form-item label="手机号码">
        <el-input v-model="temp.phone" />
      </el-form-item>
      <el-form-item label="管理员邮箱">
        <el-input v-model="temp.phone" />
      </el-form-item>
      <el-form-item label="管理员手机号码">
        <el-input v-model="temp.phone" />
      </el-form-item>
      <el-form-item label="新订单邮件提醒">
        <el-switch v-model="temp.phone" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer btnleft">
      <el-button type="primary">
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
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      }
    }
  },
  methods: {

  }
}
</script>
<style scoped>
	.btnleft{
		margin-left: 20%;
	}
</style>

