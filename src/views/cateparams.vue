<template>
    <el-card class="box-card">
        <!-- 面包屑 -->
        <myBread text1="商品管理" text2="分类参数" ></myBread>
        <el-alert class="alert" title="只允许为第三级分类设置参数" type="error"></el-alert>
        
        <!-- 级联选择器 -->
        <el-form class="formb" >
        <el-form-item label="商品名称">
            {{selectedOptions}}
            <el-cascader 
            expand-trigger="hover" 
            clearable 
            :show-all-levels="false" 
            :props="defaultProp" 
            :options="catlist" 
            v-model="selectedOptions" 
            @change="handleChange">
            </el-cascader>
        </el-form-item>
        </el-form>
    
        <!-- tab栏切换 -->
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="动态参数" name="1">
              
              <!-- 按钮设置动态参数 -->
               <el-row>
                <el-col :span="24">
                    <el-button @click="addDyparams()" :disabled="btndisable" type="danger">设置动态参数</el-button>
                </el-col>
               </el-row>

               <!-- 对话框 -->
            <el-dialog title="添加分类参数" :visible.sync="dialogFormVisible">
                <el-form :model="dyParamsForm">
                    <el-form-item label="参数名称">
                        <el-input v-model="dyParamsForm.attr_name" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="值">
                        <el-input v-model="dyParamsForm.attr_vals" autocomplete="off"></el-input>

                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addDyparamsRes()">确 定</el-button>
                </div>
            </el-dialog>

               <!-- 表格 -->
            <el-table :data="list" style="width: 100%">

                <el-table-column type="expand" label="#" width="80">
                    <template slot-scope="scope">
                    <el-tag
                        closable :disable-transitions="false"
                        @close="handleClose(scope.row.attr_vals,tag,scope.row)"
                        v-for="(tag,index) in scope.row.attr_vals"
                        :key="index">{{tag}}</el-tag>


                         <el-input
                        class="input-new-tag"
                        v-if="inputVisible"
                        v-model="inputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm(scope.row.attr_vals,scope.row)"
                        @blur="handleInputConfirm">
                        </el-input>

                        <el-button v-else
                        class="button-new-tag" size="small"
                        @click="showInput">+ New Tag</el-button>

                    </template>
                 </el-table-column> 

                <el-table-column prop="attr_name" label="属性名称" width="180">
                </el-table-column>

                 <el-table-column label="操作" width="180">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" circle size="mini" plain @click="showEditdia(scope.row)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" circle size="mini" plain @click="showDelefirm(scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>

          </el-tab-pane>
          <el-tab-pane label="静态参数" name="2">

            <el-row>
                <el-col :span="24">
                    <el-button type="danger">设置静态参数</el-button>
                </el-col>
            </el-row>


            <!-- 表格 -->
             <el-table :data="staticlist" style="width: 100%">
                <el-table-column type="index"
                label="#" width="80">

                </el-table-column>
                <el-table-column prop="attr_name"
                label="属性名称" width="180">
                </el-table-column>
                <el-table-column prop="attr_vals" label="属性值" width="180">
                </el-table-column>
                <el-table-column label="操作" width="180">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" circle size="mini" plain @click="showEditdia(scope.row)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" circle size="mini" plain @click="showDelefirm(scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>

          </el-tab-pane>
        </el-tabs>
        
    </el-card>
</template>

<script>
export default {
    data(){
        return{
        // 动态参数数组
        dyParams: [],
        // 静态参数数组
        staticlist:[],
        //级联选择器
        catlist:[],
        selectedOptions:[],
        defaultProp:{
             value: 'cat_id',
             label: 'cat_name',
             children: 'children'
            },
        // tab栏数据
        activeName: '1',
        //表格数据
        list:[
               {
                 name: '',
                 attrval: ''
               }
            ],
        // 设置动态参数按钮的响应
        btndisable: true,
        //对话框显示隐藏
        dialogFormVisible:false,
        //对话框数据
        dyParamsForm: 
          {
        attr_name: '',
        attr_sel: 'many',
        attr_vals: ''
          },
        //标签添加内容
        inputValue: '',
        inputVisible:false
        }
        
    },
    created(){
        this.getGoodsCat()
    }
    ,
    methods: {
      // 点击newTag按钮
      showInput() {
        this.inputVisible = true
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus()
        })
      },
      // 回车确定
    async handleInputConfirm(attr_vals,attr) {
      let inputValue = this.inputValue
      if (inputValue) {
        // attr_vals
        // 视图更新
       attr_vals.push(inputValue);
       // 发送请求
        const putData = {
        attr_name: attr.attr_name,
        attr_sel: 'many',
        attr_vals: attr_vals.join(',')
      }
      console.log(putData);
      
      const res = await this.$http.put(
        `categories/${this.selectedOptions[2]}/attributes/${attr.attr_id}`,
        putData
      )

      console.log(res)

      }
      this.inputVisible = false
      this.inputValue = ''
    },




      // 点击el-tag的关闭按钮
      async handleClose(attr_vals, tag, attr) {
      // attr_vals
      // 从视图中移除
      attr_vals.splice(attr_vals.indexOf(tag), 1)
      // console.log(attr_vals)
      // 发送请求 - 移除
      // 请求体参数 接口文档没有
      const putData = {
        attr_name: attr.attr_name,
        attr_sel: 'many',
        attr_vals: attr_vals.join(',')
      }
      const res = await this.$http.put(
        `categories/${this.selectedOptions[2]}/attributes/${attr.attr_id}`,
        putData
      )

      // console.log(res)
    },
      // 点击tab时 触发
       handleClick() {
         // 判断是哪个页面
         if (this.activeName==='2') {
                 this.getStaticParams()
  
         }
       },
       //获取静态参数数据
    async getStaticParams(){
        const res =
        await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=only`)
        this.staticlist = res.data.data
        // console.log('获取静态参数数据');
        // console.log(this.staticlist)

    },
     // 添加动态参数 - 发送请求
    async addDyparamsRes() {
      this.dialogFormVisible = false
      // categories/:id/attributes
      const res = await this.$http.post(
        `categories/${this.selectedOptions[2]}/attributes`,
        this.dyParamsForm
      )
    //   console.log(res)
      // 更新视图
      this.getDyParamsData()
    },
    //显示对话框
    addDyparams(){
        this.dialogFormVisible=true
    }
    ,
    //动态数据的
    async getDyParamsData() {
      const res = await this.$http.get(
        `categories/${this.selectedOptions[2]}/attributes?sel=many`
      )
      // console.log(res)
      this.list = res.data.data
      this.list.forEach(item => {
        item.attr_vals =
          item.attr_vals.trim().length === 0
            ? []
            : item.attr_vals.trim().split(',')
      })
      console.log(this.list);
      
    },
    
       // 级联选择器 选中label时
      handleChange() {
        if (this.selectedOptions.length === 3) {
          this.btndisable = false
          this.getDyParamsData()
        }
      },
      // 获取三级分类的数据
      async getGoodsCat() {
      const res = await this.$http.get(`categories?type=3`)
      // console.log(res)
      this.catlist = res.data.data
    }
    }
}
</script>

<style>
.alert {
  margin-top: 20px;
}
.formb {
  height: 50px;
  margin-top: 20px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
