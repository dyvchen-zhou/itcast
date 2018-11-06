<template>
    <el-card class="box-card">
        <!-- 面包屑 -->
       <myBread text1="商品管理" text2="商品分类" ></myBread> 

       <!-- 添加框 -->
    <el-row>
        <el-col :span="24" class="searchArea">
            <el-button type="success" @click="addGoodsCate()">添加分类</el-button>
        </el-col>
    </el-row>

    <!-- 编辑对话框 -->
    <el-dialog title="添加分类" :visible.sync="dialogFormVisibleEdit">
        <el-form :model="form">
            <!-- 输入框 -->
            <el-form-item label="分类名称" :label-width="formLabelWidth">
                <el-input v-model="form.cat_name" autocomplete="off"></el-input>
            </el-form-item>
            
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
            <el-button type="primary" @click="editCate()">确 定</el-button>
        </div>
    </el-dialog>


    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="dialogFormVisibleAdd">
        <el-form :model="form">
            <!-- 输入框 -->
            <el-form-item label="分类名称" :label-width="formLabelWidth">
                <el-input v-model="form.cat_name" autocomplete="off"></el-input>
            </el-form-item>
            <!-- 级联选择器 -->
             <el-form-item label="分类名称" :label-width="formLabelWidth">
                 {{selectedOptions}}
               <el-cascader
               placeholder="试试搜索：指南"
               :options="caslist"
               expand-trigger="hover"
                change-on-select
                clearable
               :props="defaultProp"
               v-model="selectedOptions"
            ></el-cascader>
            </el-form-item>
            
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
            <el-button type="primary" @click="addCate()">确 定</el-button>
        </div>
    </el-dialog>

    <el-table
    :data="list"
    border
    class="list-card"
    style="width: 100%"  height="500">
    <!--  ElTreeGrid 等价于 el-tree-grid
      treeKey	default:'id' 每个节点的标识 id
      parentKey	父节点的key值
      levelKey 当前节点是第几级
      childKey	子节点的key -->
     <el-tree-grid 
      prop="cat_name" 
      label="分类名称" 
      width="140" 
      treeKey="cat_id" 
      parentKey="cat_pid" 
      levelKey="cat_level" 
      childKey="children">

    </el-tree-grid>

    <el-table-column
      label="级别">
       <template slot-scope="scope">
      <span v-if="scope.row.cat_level===0">一级</span>
      <span v-else-if="scope.row.cat_level===1">二级</span>
      <span v-else-if="scope.row.cat_level===2">三级</span>      
      </template>
    </el-table-column>

    <el-table-column 
      label="是否有效" >
      <template slot-scope="scope">
                <span v-if="scope.row.cat_deleted===false">有效</span>
                <span v-else-if="scope.row.cat_deleted===true">无效</span>
      </template>
    </el-table-column>

    <el-table-column 
      label="操作" 
      width="180">
      <template slot-scope="scope">
                <el-button type="primary"
                icon="el-icon-edit" circle size="mini" plain
                @click="showEditdia(scope.row)"></el-button>
                <el-button type="danger"
                icon="el-icon-delete" circle size="mini" plain
                @click="showDelefirm(scope.row)"></el-button>
            </template>
    </el-table-column>
  </el-table>

   <!-- 分页 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum" :page-sizes="[5, 10, 15,20]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
    </el-card>
</template>

<script>
// 导入包
const ElTreeGrid = require('element-tree-grid')

export default {
    //局部自定义标签
    components: {
    // 自定义标签名:导入的对象ElTreeGrid
    ElTreeGrid
  },
    data(){
        return{
            list:[],
            pagenum: 1,
            pagesize: 10,
            total: 1,
            dialogFormVisibleEdit:false,
            dialogFormVisibleAdd:false
            ,
            //添加分类对话框的form表单数据
            form: {
            cat_pid: -1,
            cat_name: '',
            cat_level: -1
            }
            ,
            //级联选择器
            formLabelWidth: '140px',
            caslist:[],
            //  级联选择器选中的数据
            selectedOptions: [],
            defaultProp: {
            value: 'cat_id',
            label: 'cat_name',
            children: 'children'
            }

        }
    },
    created() {
             this.getGoodsCate()  
    },
    methods: {
        //发送请求提交编辑对话框
        async editCate(){
            const res = await this.$http.put(`categories/${this.form.cat_pid}`,{
                cat_name:this.form.cat_name
            })
            console.log(res);
            this.dialogFormVisibleEdit=false
            const {meta:{msg,status}}=res.data
            if(status===200){
               this.getGoodsCate()   
               this.$message({
               type: 'success',
               message: msg
               })
            }
            
        },
        //编辑按钮
        showEditdia(cat){
            this.dialogFormVisibleEdit=true
            this.form.cat_pid=cat.cat_id
            this.form.cat_name=cat.cat_name
        },


        //删除分类
        showDelefirm(cat){
            // console.log(cat);
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(async () => {
            const res = await this.$http.delete(`categories/${cat.cat_id}`)

             const {
             meta: { status, msg }
             } = res.data
             if (status === 200) {
             this.getGoodsCate()
             this.$message({
              type: 'success',
              message: msg
              })
             }

        }).catch(() => {
            this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
        },


        //添加分类
        async addCate(){
            this.dialogFormVisibleAdd=false
            if (this.selectedOptions.length === 0) {
             this.form.cat_pid = 0
            
             } else if (this.selectedOptions.length === 1) {
             this.form.cat_pid = this.selectedOptions[0]
             
             } else if (this.selectedOptions.length === 2) {
              this.form.cat_pid = this.selectedOptions[1]
              
             }
             this.form.cat_level = this.selectedOptions.length
 
             // 发送请求
             const res = await this.$http.post(`categories`, this.form)
             // console.log(res)
             const {
             meta: { status, msg }
              } = res.data
             if (status === 201) {
             this.$message.success(msg)
             this.getGoodsCate()
             } else {
              this.$message.warning(msg)
             }
             },


        // 添加分类- 显示对话框
        async addGoodsCate() {
             this.dialogFormVisibleAdd = true
             // 获取分类数据(二级)
             const res = await this.$http.get(`categories?type=2`)
     
             // console.log(res)
             this.caslist = res.data.data
             },
     
             // 分页的相关方法
             handleSizeChange(val) {
             //   console.log(`每页 ${val} 条`)
              this.pagesize = val
              this.pagenum = 1
              this.getGoodsCate()
              },
              handleCurrentChange(val) {
              //   console.log(`当前页: ${val}`)
              //   this.pagenum = 2 = val
               this.pagenum = val
               this.getGoodsCate()
              }
        ,


        //获取所有的列表
        async getGoodsCate(){
                 const res= await this.$http.get(
             `categories?type=3&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
              )
              console.log(res);
              this.list=res.data.data.result
              this.total=res.data.data.total
        }
    },
     
}
</script>

<style>
    .searchArea{
        margin-top: 30px;
        margin-bottom: 30px;
    }
</style>
