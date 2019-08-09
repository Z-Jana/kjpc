<template>
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
    <!-- :disabled="temp.status == 0 ? false: true" -->
    <!-- <el-button v-show="temp.status == 0" slot="trigger" size="small" type="primary">新增图片</el-button> -->
    <i class="el-icon-plus" />
    <!-- <el-button v-show="temp.status == 0" style="margin-left: 10px;" size="small" type="success" @click="submitCrwimg">上传图片</el-button> -->
    <!--div slot="tip" class="el-upload__tip" v-show="temp.status == 0">只能上传 jpg 或 png 文件，且不超过 2 MB</div-->
  </el-upload>
</template>
<script>
export default {
  data() {
    return {
      pathurl: 'http://192.168.1.137:8050/',
      downloadLoading: false,
      ImageList: []
    }
  },
  methods: {
    // 改变
    handleCrwimgChange(file, fileList) {
      console.log(file, fileList)
      this.ImageList = fileList
    },
    // 移除
    handleCrwimgRemove(file, fileList) {
      this.ImageList = fileList
    },
    // 已上传
    handleImagePreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 限制
    handleFileExceed(files, fileList) {
      this.$message.warning(`最大可上传一个文件！`)
    }

  }
}
</script>
<style scoped>
.upload-demo{
  float: left;
}

