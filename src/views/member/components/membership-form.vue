<template>
  <el-form 
    ref="dataForm"
    :rules="rules"
    :model="temp"
    label-position="right"
    label-width="100px"
    style="width: 80%; margin-left:50px;"
  >
    <el-form-item label="会员" prop="name">
       <el-input v-model="temp.name" placeholder="会员昵称" />
    </el-form-item>
    <el-form-item label="手机号码" prop="phone">
       <el-input v-model="temp.name" placeholder="请输入正确的手机号码" />
    </el-form-item>
    <el-form-item label="真实姓名" prop="username">
       <el-input v-model="temp.name" placeholder="真实姓名" />
    </el-form-item>
    <el-form-item label="证件信息" prop="userinfo">
    </el-form-item>
    <el-form-item label="推荐人" >
       <el-input v-model="temp.name" placeholder="" />
    </el-form-item>
    <el-form-item label="下级好友" >
       <!-- <el-input v-model="temp.name" /> -->
    </el-form-item>
    <el-form-item label="注册时间">
      <el-date-picker
        v-model="temp.date"
        type="datetime"
        placeholder="选择日期时间">
      </el-date-picker>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  data(){
    return{
      temp:{
        type: 1,
        number: "",
        name: "",
        phone:"",
        username:"",
        date:"",
        status: ""
      },
      rules: {
        name: [{ required: true, message: '必填', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        phone: [{ required: true, message: '字段必填', trigger: 'blur' }],
        username: [{ required: true, message: '字段必填', trigger: 'blur' }]
      },
    }
  }
}
</script>

