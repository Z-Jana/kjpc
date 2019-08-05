<template>
  <!-- 收货信息 -->
  <div class="app-container">
    <el-table
      :data="tableData"
      style="width: 100%;border-top:1px solid #dfe6ec;"
    >
      <el-table-column
        prop="name"
        label="收货人"
        min-width="120"
      />
      <el-table-column
        prop="zip"
        label="手机号码"
        min-width="120"
      />
      <el-table-column
        prop="address"
        label="收货地址"
        min-width="300"
      />

    </el-table>
    <!-- <el-table
      :width="1000"
      :columns="columns"
      :data="tableData"
      :show-vertical-border="false"
    /> -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: [{ name: '张三', zip: '111111111', address: '广东省深圳市罗湖区东晓街道富基park国际大厦22层' }]
    }
  }

}
</script>
<style scoped>

</style>
