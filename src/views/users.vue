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
        <el-col :span="10">
            <el-input placeholder="请输入内容" class="input-with-select ">
                <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
        </el-col>
        <el-col :span="4">
            <el-button type="success">添加用户</el-button>

        </el-col>

    </el-row>


    <!-- 表格 -->
    <el-table
    :data="list"
    border
    style="width: 100%">
    <el-table-column
      fixed
      prop="username"
      label="姓名"
      width="150">
    </el-table-column>
    <el-table-column
      prop="email"
      label="邮箱"
      width="120">
    </el-table-column>
    <el-table-column
      prop="create_time"
      label="创建日期"
      width="120">
    </el-table-column>
    <el-table-column
      prop="mobile"
      label="电话"
      width="120">
    </el-table-column>
     <el-table-column
      label="用户状态"
      width="120">
       <el-switch active-color="#13ce66" inactive-color="#ff4949">
        </el-switch>
    </el-table-column>
    <el-table-column
      label="操作"
      width="100">
    </el-table-column>
  </el-table>
  </el-card>
</template>

<script>
export default {

    async mounted(){
        // 需要设置请求头 Authorization = token
        const AUTH_TOKEN = sessionStorage.getItem('token')
        //查axios文档
        this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
        const res = await this.$http.get('users?pagenum=1&pagesize=10')

        const {meta,data} = res.data
        if (meta.status===200) {
            this.list = data.users

        }

    },

    data() {
      return {
       list:[]
      }
    }
  
}
</script>

<style>
.sousuotop{
    margin-top: 10px;
    margin-bottom: 10px;
}

</style>
