<template>
    <el-card class="box-card">
        <!-- 面包屑 -->
        <myBread text1="商品管理" text2="商品列表" ></myBread>
        <el-alert class="info" title="添加商品信息" type="success" center show-icon>
        </el-alert>

        <!-- 步骤条 -->
        <el-row>
            <el-col :span="24">
                <el-steps class="steps" :space="200" align-center :active="active*1" finish-status="success">
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                </el-steps>
            </el-col>
        </el-row>

        <el-form class="form" v-model="form">
             <el-tabs v-model="active"  tabPosition="left"  @tab-click="tabChange()">

             <el-tab-pane name="1" label="基本信息" >
                 <el-form-item label="商品名称">
                    <el-input v-model="form.goods_name"></el-input>
                </el-form-item>
                <el-form-item label="商品价格">
                    <el-input v-model="form.goods_price"></el-input>
                </el-form-item>
                <el-form-item label="商品重量">
                    <el-input v-model="form.goods_weight"></el-input>
                </el-form-item>
                <el-form-item label="商品数量">
                    <el-input v-model="form.goods_number"></el-input>
                </el-form-item>
                <el-form-item label="商品分类">
                    <!-- 联级选择器 -->
                     <br>
                          {{selectedOptions}}
                        <el-cascader
                        placeholder="试试搜索：指南"
                        :options="catlist"
                        expand-trigger="hover"
                         change-on-select
                         clearable
                        :props="defaultProp"
                        v-model="selectedOptions"
                         ></el-cascader>
                      
                </el-form-item>   
             </el-tab-pane>

             <el-tab-pane name="2" label="商品参数" >
                 <el-form-item  :label="item.attr_name" v-for="item in dyParams" :key="item.attr_id"><br>
                     <el-checkbox-group v-model="item.attr_vals">
                        <el-checkbox v-for="(item2,index) in item.attr_vals" border :label="item2" :key="index"></el-checkbox>
                    </el-checkbox-group>
                 </el-form-item>
             </el-tab-pane>

             <el-tab-pane name="3" label="商品属性" >
                 <el-form-item  :label="item.attr_name" v-for="item in staticParams" :key="item.attr_id"><br>
                        <el-input v-model="item.attr_vals"></el-input>
                 </el-form-item>
             </el-tab-pane>

             <el-tab-pane name="4" label="商品图片" >
                 <el-upload
                    :headers="headers"
                    multiple
                    action="http://localhost:8888/api/private/v1/upload"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :on-success="handleSuccess"
                    list-type="picture">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                 </el-upload>
             </el-tab-pane>

             <el-tab-pane name="5" label="商品内容" >
                 <el-button  type="primary"
                @click="addGoods()"
                >添加商品</el-button>
                
                <!-- 富文本编辑器 -->
                <quill-editor
                v-model="form.goods_introduce">
                </quill-editor>
             </el-tab-pane>
       </el-tabs>
        </el-form>
    </el-card>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'

export default {

    //局部组件
    components: {
    quillEditor
    },
    data(){
        return{
             active: '1',

             //表单数据
             form:{
                goods_name:'',
                goods_price:'',
                goods_weight:'',
                goods_number:'',
                //商品内容
                goods_introduce:'',
                // 上传的图片临时路径（对象）	{pic:图片的临时路径}
                pics: [],
                // 以为','分割的分类列表
                goods_cat: '',
                //静态和动态数组
                attrs:[]

             },
              // 级联选择器的数据
             catlist: [],
             selectedOptions: [],
             defaultProp: {
                 value: 'cat_id',
                 label: 'cat_name',
                 children: 'children'
             },
             //动态数组
             dyParams:[],
             //静态数组
             staticParams:[],
              // 图片上传的头部设置
             headers: {
             Authorization: sessionStorage.getItem('token')
             }
        }
    },
    created() {
               this.getGoodsCat()  
    },
    methods: {
        //添加商品
        async addGoods(){
            // 转换类型
            this.form.goods_cat = this.selectedOptions.join(',')

            //动态
            const arr1 = this.dyParams.map(item => {
              return { attr_id: item.attr_id, attr_vals: item.attr_vals }
            })
            //静态
            const arr2=this.staticParams.map(item=>{
                return{attr_id: item.attr_id, attr_vals: item.attr_vals}
            })

             this.form.attrs = [...arr1,...arr2]

             //发送请求
             const res = await this.$http.post(`goods`,this.form)
             console.log(res)
             const {meta:{status,msg}} = res.data
             if (status===201) {
               this.$message.success(msg)
               // 回到列表页
               this.$router.push({path:'/goodslist'})
             }
        },

        //上传图片的钩子函数
        handlePreview(file){
            //点击列表已上传的文件时触发
            console.log(file);
            
        },
        handleRemove(file){
            //移出已上传文件是触发
            //根据钩子函数返回的数据找到一样的地址并且返回当前数据在数组中的索引
            const Index=this.form.pics.findIndex(item=>{
                return item.pic===file.response.data.tmp_path
            })
            //从数组中移除
            this.form.pics.splice(Index,1)
        },
        handleSuccess(res){    
            //上传成功后触发
             this.form.pics.push({
             pic: res.data.tmp_path
             })
            //  console.log(res);
             const {meta:{msg,status}}=res
             if(status===200){
                 this.$message.success(msg)
             }
            //  console.log(this.form.pics);
             
             
        },

        //tab 被选中时触发
        async tabChange(){
            //判断是不是点击2，3的tab栏，如果是，再次判断1.是不是选择了联级选择器
            if(this.active==='2'||this.active==='3'){
                if(this.selectedOptions.length!==3){
                     this.$message.error('请先选择商品三级分类')
                    return
                }
                //判断获取动态还是静态表单数据
                const sel=this.active==='2'?'many':'only'
                const res =await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=${sel}`) 


                //判断active是2还是3来判断数据是动态还是静态的
                if(this.active==='2'){
                    this.dyParams = res.data.data
                    console.log(this.dyParams);

                    //处理数据
                    this.dyParams.forEach(item => {
                        item.attr_vals=item.attr_vals.length===0?[]:item.attr_vals.trim().split(',')
                    });
                    
                }else{
                    this.staticParams=res.data.data
                    console.log(this.staticParams);
                    
                }
            }
        },
        //获取级联选择器的数据
        async getGoodsCat(){
            const res =await this.$http.get(`categories?type=3`)
            console.log(res);
            this.catlist = res.data.data
        }
      
    }
}
</script>

<style>
    .el-step__title{
        font-size: 10px;
    }
    .info{
        margin-top: 10px;
        margin-bottom: 10px;
    }
    .steps{
        margin-top: 20px;
    }
    .form {
        /* 设置隐藏并生成滚动条 */
      height: 450px;
      overflow: auto;
    }
    .ql-editor {
    min-height: 200px;
    }
</style>
