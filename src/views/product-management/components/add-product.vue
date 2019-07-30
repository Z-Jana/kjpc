<template>
  <!-- <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible"> -->
  <el-form
    ref="dataForm"
    :rules="rules"
    :model="temp"
    label-position="left"
    label-width="70px"
    style="width: 80%; margin-left:50px;"
  >
    <el-form-item label="商品类型" prop="type">
      <el-select v-model="temp.type" class="filter-item" placeholder="Please select">
        <el-option
          v-for="item in calendarTypeOptions"
          :key="item.key"
          :label="item.name"
          :value="item.key"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="商品编码" prop="number">
      <el-input v-model="temp.number" placeholder="自动生成" />
    </el-form-item>
    <el-form-item label="商品名称" prop="name">
      <el-input v-model="temp.name" />
    </el-form-item>
    <el-form-item label="商品分类">
      <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
        <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
      </el-select>
    </el-form-item>
		<el-row>
    <el-form-item label="商品图片" prop="name">
      <el-input v-model="temp.name" />
    </el-form-item>
		</el-row>
    <el-row :gutter="10">
      <el-col :span="20">
        <el-form-item label="预定周期" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <span style="line-height:36px">天</span>
      </el-col>
    </el-row>
		<el-row :gutter="10">
      <el-col :span="20">
				<el-form-item label="金重" prop="name">
					<el-input v-model="temp.name" />
					<span style="margin-left:20%">实时金价计费，当前金价 312.54/克</span>
				</el-form-item>
				
      </el-col>
			<el-col :span="4">
        <span style="line-height:36px">克</span>
      </el-col>
		</el-row>
		<el-row :gutter="10">
      <el-col :span="20">
        <el-form-item label="工费" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <span style="line-height:36px">/克</span>
      </el-col>
    </el-row>
		<el-row :gutter="10">
      <el-col :span="20">
        <el-form-item label="运费" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <span style="line-height:36px">元</span>
      </el-col>
    </el-row>
		<el-row :gutter="10">
      <el-col :span="20">
        <el-form-item label="违约金比例" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <span style="line-height:36px">%</span>
      </el-col>
    </el-row>
		<el-row>
			<el-col :span="20">
				<el-form-item label="商品库存" prop="name">
					<el-input v-model="temp.name" />
				</el-form-item>
			</el-col>
		</el-row>
		<el-row :gutter="10">
      <el-col :span="20">
        <el-form-item label="赠送积分比例" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <span style="line-height:36px">%</span>
      </el-col>
    </el-row>
		<el-row :gutter="10">
      <el-col :span="20">
        <el-form-item label="推荐奖励比例" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <span style="line-height:36px">%</span>
      </el-col>
    </el-row>

  </el-form>

</template>
<script>
export default {
  data() {
    return {
      dialogFormVisible: false,
      calendarTypeOptions: [
        { name: "预定商品", key: 1 },
        { name: "实物商品", key: 2 }
      ],
      statusOptions: ["分类1", "分类2", "分类3"],
      temp: {
        type: 1,
        number: "",
        name: "",
        status: ""
			},
			rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
    };
  }
};
</script>

<style>
	.el-form-item__label{
		width:20%!important;
	}
	.el-form-item__content{
		margin-left: 20%!important;
	}

</style>

