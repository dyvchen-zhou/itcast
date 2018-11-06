<template>
    <!-- 卡片容器 -->
<el-card class="box-card">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索框 -->
    <el-row class="sousuotop">
        <el-col :span="7">
            <el-input placeholder="请输入内容"  v-model="searchVal" class="input-with-select  searchInput" clearable>
                <el-button slot="append" icon="el-icon-search" @click="searchUser()"></el-button>
            </el-input>
        </el-col>
        <el-col :span="4">
            <el-button type="success" @click="showDiaAddUser()">添加用户</el-button>

        </el-col>

    </el-row>

      <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRoleuser">
        <el-form>
            <el-form-item label="用户名" :label-width="formLabelWidth">
                <!-- 需要一个用户名 -->
                {{currUserName}}
            </el-form-item>
            <el-form-item label="角色" :label-width="formLabelWidth">
                <el-select v-model="currRoleId">
                  <!-- v-model绑定的值 和 el-option的value值 如果一样
                    当前显示的就是该option的label值
                   -->
                    <el-option disabled label="请选择" :value="-1"></el-option>
                    <el-option
                    v-for="(item,index) in roles"
                    :key="index"
                    :label="item.roleName" :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleRoleuser = false">取 消</el-button>
            <el-button type="primary" @click="setRole()">确 定</el-button>
        </div>
    </el-dialog>


    <!-- 编辑按钮对话框 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdituser">
        <el-form :model="formData">
            <el-form-item label="用户名" :label-width="formLabelWidth">
                <el-input disabled v-model="formData.username" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" :label-width="formLabelWidth">
                <el-input v-model="formData.email" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="电话" :label-width="formLabelWidth">
                <el-input v-model="formData.mobile" autocomplete="off"></el-input>
            </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleEdituser = false">取 消</el-button>
            <el-button type="primary" @click="editUser()">确 定</el-button>
        </div>
    </el-dialog>


    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdduser">
        <el-form :model="formData">
            <el-form-item label="用户名" :label-width="formLabelWidth">
                <el-input v-model="formData.username" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码" :label-width="formLabelWidth">
                <el-input v-model="formData.password" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" :label-width="formLabelWidth">
                <el-input v-model="formData.email" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="电话" :label-width="formLabelWidth">
                <el-input v-model="formData.mobile" autocomplete="off"></el-input>
            </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleAdduser = false">取 消</el-button>
            <el-button type="primary" @click="addUser()">确 定</el-button>
        </div>
    </el-dialog>

    <!-- 表格 -->
    <el-table
    :data="list"
    v-loading="loading"
    style="width: 100%">

     <!-- 序号 -->
      <el-table-column
      type="index"
      width="50">
    </el-table-column>

    <el-table-column
      prop="username"
      label="姓名"
      width="100">
    </el-table-column>
    <el-table-column
      prop="email"
      label="邮箱"
      width="150">
    </el-table-column>
    <el-table-column
      prop="create_time"
      label="创建日期"
      width="150">

        <template slot-scope="scope">
            {{scope.row.create_time | fmtDate('YYYY-MM-DD')}}
        </template>

    </el-table-column>
    <el-table-column
      prop="mobile"
      label="电话"
      width="150">
    </el-table-column>
     <el-table-column
      label="用户状态"
      prop="mg_state"
      width="150">
        <template slot-scope="scope">
            <!-- scope.row就是当前绑定的数据对象就是 list数组 -->
         <el-switch
            v-model="scope.row.mg_state"
            @change="changeMgState(scope.row)"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
      </template>
    </el-table-column>
    <el-table-column
      label="操作"
      min-width="300">
      <!-- 最小宽度 -->
         <template slot-scope="scope">
        <el-button plain size="mini" type="primary" icon="el-icon-edit" circle @click="showEditdia(scope.row)"></el-button>
        <el-button plain size="mini" type="danger" icon="el-icon-delete" circle @click="showDelefirm(scope.row)"></el-button>
        <el-button plain size="mini" type="success" icon="el-icon-check" circle @click="showRoledia(scope.row)"></el-button>
      </template>
    </el-table-column>
  </el-table>

  <!-- 分页 -->
  <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[4, 6, 8, 10]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </el-card>
</template>

<script>
export default {

    mounted(){
      this.loadTableData()  
    },
    methods:{
        //分配角色的按钮
        async setRole(){
            //关闭窗口
            this.dialogFormVisibleRoleuser=false
            //发送请求
            const res = await this.$http.put(`users/${this.getRoleByUserId}/role`,{
          rid:this.currRoleId
        })
        const {meta:{status,msg}} = res.data
        if (status===200) {
        this.$message.success(msg)
        }


        },


        //编辑按钮
        async editUser(){
            //关闭对话
            this.dialogFormVisibleEdituser = false

            const res= await this.$http.put(`users/${this.currUserId}`, this.formData)

            const {meta:{msg,status}}=res.data
            if(status===200){
                this.$message.success(msg)
                this.loadTableData()
            }
        },


        //添加提交按钮
        async addUser(){
            // 关闭对话框
            this.dialogFormVisibleAdduser = false
            const res =await this.$http.post('users', this.formData)
            const {meta:{msg,status}}=res.data
            if(status===201){
                //清空了表数据
                for (const key in this.formData) {
                  //hasOwnProperty判断对象是否有这个属性
                  if(this.formData.hasOwnProperty(key)){
                      this.formData[key]=''
                  }
                    
                }
                
                this.$message.success(msg)
                this.loadTableData()
            }
            
        },

        // 添加用户 - 显示对话框
        showDiaAddUser(user) {
            this.dialogFormVisibleAdduser = true
        },
        //编辑按钮 -显示对话
        showEditdia(user){
            this.dialogFormVisibleEdituser = true
            console.log(user);
            
            this.formData=user
            this.currUserId = user.id
        },
        //分配角色-显示对话
        async showRoledia(user){
            this.dialogFormVisibleRoleuser=true
            //获取当前用户的id
            this.getRoleByUserId = user.id
            //获取用户的名字
            this.currUserName = user.username
            //获取职员的信息列表
            const res =await this.$http.get('roles') 
            this.roles=res.data.data
            console.log(this.roles);
            //显示当前用户角色
            // console.log(user);
            // 要通过users/:id请求 获取当前用户的role_id
            const res1 = await this.$http.get(`users/${user.id}`)
            console.log(res1);
            // 实际rid
            this.currRoleId =  res1.data.data.rid
        },



        //删除事件
        showDelefirm(user){
            
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
           })
        .then(async () => {
                const res= await this.$http.delete(`users/${user.id}`)
                const {meta:{msg,status}}=res.data
                 if (status === 200) {
                // 提示框
                //      返回分页为1的页面
                        this.pagenum = 1
                        this.loadTableData() 
                this.$message.success(msg)
                }
           })
        },



        //修改状态
        async changeMgState(user){
            console.log(user);
            
            const res = await this.$http.put(`users/${user.id}/state/${user.mg_state}`)
            // console.log(res);
            const {meta:{msg,status}}=res.data
             if (status === 200) {
                // 提示框

                this.$message.success(msg)
            }
            
        },

         //搜索事件
        searchUser(){
        this.loadTableData()
        },
         // 分页的相关方法
        handleSizeChange(val) {
            // console.log(`每页 ${val} 条`)
            this.pagesize = val
            this.loadTableData()
        },
        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`)
            // this.pagenum = 2 = val
            this.pagenum = val
            this.loadTableData()
        },

        //获取所有的信息
        async loadTableData(){
        this.loading = true
        // 需要设置请求头 Authorization = token
        const AUTH_TOKEN = sessionStorage.getItem('token')
        //查axios文档
        this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
        const res = await this.$http.get(`users?pagenum=${this.pagenum}&pagesize=${this.pagesize}&query=${this.searchVal}`)

        const {meta,data} = res.data
        if (meta.status===200) {
            this.list = data.users
            this.loading = false
            this.total=res.data.data.total
            } 
        }
    },

    data() {
      return {
       list:[],
       loading:false,
       //分页相关的数据
       total:10,
       pagesize:4,
       pagenum:1,
       //搜索框
       searchVal:'',
       //分配角色对话框
       dialogFormVisibleRoleuser:false,
       currUserName:'',
       // 当前角色id
       currRoleId:-1,
       // [角色,测试角色2,超级管理员等]
            roles:[],
            getRoleByUserId:-1,
       //添加用户的对话框
       dialogFormVisibleAdduser: false,
       //编辑对话框
       dialogFormVisibleEdituser:false,
       currUserId: -1,
       //表格的数据
       formData:{
           username:'',
           password:'',
           email:'',
           mobole:''
       },
       formLabelWidth: '140px',
      }

    }
  
}
</script>

<style>
.sousuotop{
    margin-top: 30px;
    margin-bottom: 30px;
}
.sousuotop .searchInput {
    width: 350px;
}
</style>
