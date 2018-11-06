<template>
   <el-card class="box-card">
       <!-- 面包屑 -->
       <myBread text1="权限管理" text2="角色列表" ></myBread>

       <!-- 添加按钮 -->
       <el-col>
        <el-col :span="24" class="addbtn">
            <el-button type="primary">+角色</el-button>
        </el-col>
    </el-col>

    <!-- 表格 -->
    <el-table
    :data="list"
    style="width: 100%">
    <el-table-column type="expand">
      <template slot-scope="scope">
          <!-- 渲染页面 -->
          <!-- 先渲染一行，自里面渲染两列，再在第二列 渲染一行两列 -->
          <!-- scope.row 每个人的 -->
          <!-- scope.row 就是数组中的每个对象 其中 row是固定的 -->
          <el-row class="level1" v-for="(item1,index) in scope.row.children" :key="index">
              <el-col :span="4">
                        <el-tag   @close="deleRight(scope.row,item1.id)" closable type="success">{{item1.authName}}</el-tag>
                        <i class="el-icon-caret-right"></i>
               </el-col>
               <el-col :span="20">
                        <el-row class="level2" v-for="(item2,index) in item1.children" :key="index">
                            <el-col :span="4">
                                <el-tag @close="deleRight(scope.row,item2.id)" closable type="info">{{item2.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <el-col :span="20">
                                <el-tag @close="deleRight(scope.row,item3.id)" closable type="warning" v-for="(item3,index) in item2.children" :key="index">{{item3.authName}}</el-tag>
                            </el-col>
                        </el-row>
                </el-col>
          </el-row>

          <el-row v-if="scope.row.children.length===0">
                    <span>该角色未分配权限</span>
          </el-row>

      </template>
    </el-table-column>


    <el-table-column
      label="#"
      type="index">
    </el-table-column>
    <el-table-column
      label="角色名称"
      prop="roleName">
    </el-table-column>
    <el-table-column
      label="角色描述"
      prop="roleDesc">
    </el-table-column>
    <el-table-column
      label="操作">
      <template slot-scope="scope">
        <el-button type="primary" icon="el-icon-edit" circle size="mini" plain @click="showEditdia(scope.row)"></el-button>
        <el-button type="success" icon="el-icon-check" circle size="mini" plain @click="showSetRightDia(scope.row)"></el-button>
        <el-button type="danger" icon="el-icon-delete" circle size="mini" plain @click="showDelefirm(scope.row)"></el-button>       
       </template>
    </el-table-column>
  </el-table>

  <!-- 页面分配弹框 -->
  <el-dialog
      title="分配权限"
      :visible.sync="dialogVisible"
      width="30%"
      >
    <template slot-scope="scope">
        <el-tree
        ref="tree"
        :data="treelist"
        :props="defaultProps"
        show-checkbox
        default-expand-all
        node-key="id"
        :default-checked-keys="checkArr"
        ></el-tree>
    </template>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRight()">确 定</el-button>
      </span>
    </el-dialog>

   </el-card>
</template>

<script>
export default {
     data() {
      return {
       list:[],
        //页面分配所需要的数据
       dialogVisible:false,
       treelist: [],
       defaultProps: {
        children: 'children',
        label: 'authName'
      },
      checkArr:[],
      currRoleId:-1,
      }
    },
    created(){
       this.loadTableData() 
    },
    methods: {
    //修改权限操作
    async setRight(){
       

        //获取当前选中的id
        const arr1 =this.$refs.tree.getCheckedKeys()
        const arr2=this.$refs.tree.getHalfCheckedKeys()
        // es6新特性，合并数组
        const arr=[...arr1,...arr2]
        // console.log(arr);
        //发送请求
        const res=await this.$http.post(`roles/${this.currRoleId}/rights`, {
        rids: arr.join(',')
      })
      
       this.dialogVisible=false
        
        const {meta:{msg,status}}=res.data
        if(status===200){
            this.$message.success(msg)
            this.loadTableData() 
        }
    },


    
    //显示分配权限弹框页面并且渲染数据
    async showSetRightDia(role){
        this.dialogVisible=true
        //获取当前点击的id
        this.currRoleId = role.id
        // 获取所有权限
        const res = await this.$http.get(`rights/tree`)
        // console.log(res)
        this.treelist = res.data.data
        // console.log(this.treelist);
        
        //获取当前角色的权限
        const arrCheck=[]
        role.children.forEach(item1 => {
            item1.children.forEach(item2=>{
                item2.children.forEach(item3=>{
                    arrCheck.push(item3.id)
                })
            })
        })
        this.checkArr=arrCheck
    },
    
    //删除权限
    async deleRight(role,rightId){
        const res =await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
        // console.log(res);
        
        const {
        meta: { msg, status }
        } = res.data
        if(status===200){
             // 刷新当前的数据 -> 给当前的children重新赋值
        role.children = res.data.data
        }
    },

    //渲染页面的数据
    async loadTableData() {
        const res = await this.$http.get(`roles`)
        // console.log(res)

        this.list = res.data.data
        console.log(this.list);
        
       }
    }
}
</script>

<style>
.box-card {
  height: 100%;
}

.addbtn {
  margin-top: 20px;
}

.level1 {
  margin-bottom: 10px;
}

.level2 {
  margin-bottom: 10px;
}
</style>
