<template>
  <el-form
    ref="dataForm"
    :rules="rules"
    :model="temp"
    label-position="right"
    label-width="100px"
    style="width: 90%; margin-left:50px;"
  >
    <el-form-item label="商品类型" prop="brand_id">
      <el-select v-model="temp.brand_id" class="filter-item" placeholder="请选择">
        <el-option
          v-for="item in goodsTypeOptions"
          :key="item.key"
          :label="item.name"
          :value="item.key"
        />
      </el-select>
    </el-form-item>
    <!-- <el-form-item label="商品编码" prop="number">
      <el-input v-model="temp.number" placeholder="自动生成" />
    </el-form-item> -->
    <el-form-item label="商品名称" prop="goods_name">
      <el-input v-model="temp.goods_name" style="width：80%" />
    </el-form-item>
    <!-- <el-form-item label="商品分类">
      <el-cascader
        v-model="temp.cat_id"
        :options="catOptions"
        :props="{checkStrictly: true }"
        clearable
      />
    </el-form-item> -->
    <el-row>
      <el-form-item label="商品图片" prop="original_img">
        <el-upload
          class="upload-demo"
          action=""
          :limit="5"
          :multiple="true"
          :on-preview="handleImagePreview"
          :on-exceed="handleFileExceed"
          :on-change="handleCrwimgChange"
          :on-remove="handleCrwimgRemove"
          :file-list="ImageList"
          list-type="picture-card"
          :auto-upload="false"
        >
          <i class="el-icon-plus" />
        </el-upload>
      </el-form-item>
    </el-row>
    <el-row>
      <el-col :span="20">
        <el-form-item label="商品库存" prop="store_count">
          <el-input v-model="temp.store_count" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="20">
        <el-form-item label="预定周期" prop="predetermined_day">
          <el-input v-model="temp.predetermined_day" />
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <span style="line-height:36px">天</span>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="20">
        <el-form-item label="金重" prop="gold_weight">
          <el-input v-model="temp.gold_weight" />
          <span style="margin-left:20%">实时金价计费，当前金价 312.54/克</span>
        </el-form-item>

      </el-col>
      <el-col :span="4">
        <span style="line-height:36px">克</span>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="20">
        <el-form-item label="工费" prop="process_price">
          <el-input v-model="temp.process_price" />
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <span style="line-height:36px">/克</span>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="20">
        <el-form-item label="运费" prop="shipping_price">
          <el-input v-model="temp.shipping_price" type="number" />
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <span style="line-height:36px">元</span>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="20">
        <el-form-item label="违约金比例">
          <el-input v-model="temp.damages_price_rate" type="number" />
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <span style="line-height:36px">%</span>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="20">
        <el-form-item label="赠送积分比例">
          <el-input v-model="temp.give_integral_rate" type="number" />
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <span style="line-height:36px">%</span>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="20">
        <el-form-item label="推荐奖励比例">
          <el-input v-model="temp.first_integral_rate" type="number" />
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <span style="line-height:36px">%</span>
      </el-col>
    </el-row>
    <el-form-item label="规格">
      <el-checkbox v-model="temp.is_specs" active-value="1" inactive-value="2">启用多规格</el-checkbox>
    </el-form-item>
    <!-- <el-form-item> -->
    <el-row>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="standardCreate">
        添加规格
      </el-button>
    </el-row>
    <!-- </el-form-item> -->
    <!-- <el-row>
      <el-table
        :data="standardList"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="重量" min-width="100px">
          <template slot-scope="scope">
            <el-input v-model="scope.row.title" :autosize="{ minRows: 2, maxRows: 4}" />
          </template>
        </el-table-column>
        <el-table-column label="周期" min-width="100px">
          <template slot-scope="scope">
            <el-input v-model="scope.row.title" :autosize="{ minRows: 2, maxRows: 4}" />
          </template>
        </el-table-column>
        <el-table-column label="编码" min-width="100px">
          <template slot-scope="scope">
            <el-input v-model="scope.row.title" :autosize="{ minRows: 2, maxRows: 4}" />
          </template>
        </el-table-column>
        <el-table-column label="金重" min-width="100px">
          <template slot-scope="scope">
            <el-input v-model="scope.row.title" :autosize="{ minRows: 2, maxRows: 4}" />
          </template>
        </el-table-column>
        <el-table-column label="工费/件" min-width="100px">
          <template slot-scope="scope">
            <el-input v-model="scope.row.title" :autosize="{ minRows: 2, maxRows: 4}" />
          </template>
        </el-table-column>
        <el-table-column label="违约金(%)" min-width="100px">
          <template slot-scope="scope">
            <el-input v-model="scope.row.title" :autosize="{ minRows: 2, maxRows: 4}" />
          </template>
        </el-table-column>
        <el-table-column label="赠送积分(%)" min-width="100px">
          <template slot-scope="scope">
            <el-input v-model="scope.row.title" :autosize="{ minRows: 2, maxRows: 4}" />
          </template>
        </el-table-column>
        <el-table-column label="一级推荐奖励(%)" min-width="150px">
          <template slot-scope="scope">
            <el-input v-model="scope.row.title" :autosize="{ minRows: 2, maxRows: 4}" />
          </template>
        </el-table-column>
        <el-table-column label="二级推荐奖励(%)" min-width="150px">
          <template slot-scope="scope">
            <el-input v-model="scope.row.title" :autosize="{ minRows: 2, maxRows: 4}" />
          </template>
        </el-table-column>

      </el-table>

    </el-row>
     -->
    <el-form-item label="自提点提货">
      <el-radio-group v-model="temp.is_self_sufficiency">
        <el-radio :label="1">
          支持
        </el-radio>
        <el-radio :label="0">
          不支持
        </el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="是否显示">
      <el-radio-group v-model="temp.is_on_sale">
        <el-radio :label="1">
          上架
        </el-radio>
        <el-radio :label="2">
          下架
        </el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item prop="content" label="商品描述" style="margin-bottom: 30px;">
      <Tinymce ref="editor" v-model="temp.goods_content" :height="400" />
    </el-form-item>
  </el-form>

</template>
<script>
import Tinymce from '@/components/Tinymce'
import { getToken } from '@/utils/auth'
import { goodsCategoryPageApi, goodsPageApi } from '@/api/product'
export default {
  components: { Tinymce },
  props: {
    temp: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      goodsTypeOptions: [
        { name: '预定商品', key: 1 },
        { name: '实物商品', key: 2 },
        { name: '积分商品', key: 3 }
      ],
      fenListQuery: {
        page: 1,
        limit: 20,
        token: getToken()
      },
      catOptions: [],
      rules: {
        goods_name: [{ required: true, message: '字段不能为空', trigger: 'blur' }],
        predetermined_day: [{ required: true, message: '字段不能为空', trigger: 'blur' }],
        gold_weight: [{ required: true, message: '字段不能为空', trigger: 'blur' }],
        process_price: [{ required: true, message: '字段不能为空', trigger: 'blur' }],
        brand_id: [{ required: true, message: 'type is required', trigger: 'change' }]
      },
      dialogVisible: false,
      dialogImageUrl: '',
      ImageList: [],
      standardList: [{ title: '' }]
    }
  },
  mounted() {
    console.log(this.temp, 2222)
    // this.temp = this.tempData
    this.getGoodsCategory()
  },
  methods: {
    getGoodsCategory() {
      goodsCategoryPageApi.getGoodsCategoryPage(this.fenListQuery).then(response => {
        console.log(response.data.data)
        // var listdata = response.data.data
        // var arr = []
        // for (let i = 0; i < listdata.length; i++) {
        //   arr.push({
        //     value: listdata[i].id,
        //     label: listdata[i].name
        //   })
        // }
        // console.log(arr)

        this.catOptions = [{
          value: '4',
          label: '分类1',
          children: [{
            value: '7',
            label: '分类1-3',
            children: [{
              value: '9',
              label: '分类1-3-1'
            }] }, {
            value: '78',
            label: '分类1-1'
          }]
        }, {
          value: '1',
          label: '服饰',
          children: [{
            value: '2',
            label: 'T恤'
          }]
        }]
      })
    },
    // 添加规格
    standardCreate() {

    },
    // 组件保存
    goodsConfirm() {
      return new Promise((resolve, reject) => {
        this.$refs['dataForm'].validate(vaild => {
          if (vaild) {
            this.temp.goods_img_file = this.ImageList
            console.log(JSON.stringify(this.temp))
            goodsPageApi.addUpdateGoods(this.temp).then(res => {
              console.log(res.data)
              if (res.data.code === 200) {
                resolve(Object.assign(this.temp, res.data.data))
                this.$Message.success(res.data.message)
              } else {
                reject('warning')
                this.$Message.warning(res.data.message)
              }
            }).catch(err => {
              this.$Message.error('系统错误！')
            })
          } else {
            reject('valid')
            this.$Message.warning('请填写必填项')
          }
        })
      })
    },
    // 图片上传
    handleCrwimgChange(file, fileList) {
      console.log(file, fileList)
      this.ImageList = fileList
    },
    handleCrwimgRemove(file, fileList) {
      this.ImageList = fileList
    },
    handleImagePreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleFileExceed(files, fileList) {
      this.$message.warning(`最大可上传5个文件！`)
    }

  }
}
</script>

<style>
	/* .el-form-item__label{
		width:20%!important;
	}
	.el-form-item__content{
		margin-left: 20%!important;
	} */

</style>

