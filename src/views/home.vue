<template>
    <el-container class="container">
        <el-header class="header"> 
            <el-row>
                <el-col :span="4">
                    <div class="grid-content bg-purple">
                        <img src="../assets/logo.png" alt="">
                    </div>
                </el-col>
                <el-col :span="19" class="middle">
                    <h2>电商后台管理系统</h2>
                </el-col>
                <el-col :span="1">
                        <a href="#"  class="loginout"  @click.prevent="handleSignout()">退出</a>   
                </el-col>    
            </el-row>    
        </el-header>
        <el-container>
 

    <el-aside width="200px" class="aside">

    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">

        <!-- :router 开启路由模式 如果值为true
            被激活的导航的index可以修改path标识
           -->
    <el-menu default-active="1"
            class="el-menu-vertical-demo"
            :unique-opened="true"
            :router="true">
      <el-submenu index="1">
        <template slot="title"><i class="el-icon-message"></i>用户管理</template>
        <el-menu-item-group>
 
          <el-menu-item index="/users">用户列表</el-menu-item>

        </el-menu-item-group>
      </el-submenu>

      <el-submenu index="2">
        <template slot="title"><i class="el-icon-menu"></i>权限管理</template>
        <el-menu-item-group>

          <el-menu-item index="/role">角色列表</el-menu-item>
          <el-menu-item index="/rights">权限列表</el-menu-item>
        </el-menu-item-group>
      </el-submenu>

      <el-submenu index="3">
        <template slot="title"><i class="el-icon-setting"></i>商品管理</template>
        <el-menu-item-group>

          <el-menu-item index="/goodslist">商品列表</el-menu-item>
          <el-menu-item index="3-2">分类参数</el-menu-item>
          <el-menu-item index="/goodscate">商品分类</el-menu-item>
        </el-menu-item-group>
      </el-submenu>

      <el-submenu index="4">
        <template slot="title"><i class="el-icon-setting"></i>订单管理</template>
        <el-menu-item-group>

          <el-menu-item index="4-1">订单列表</el-menu-item>

        </el-menu-item-group>
      </el-submenu>

      <el-submenu index="5">
        <template slot="title"><i class="el-icon-setting"></i>数据统计</template>
        <el-menu-item-group>

          <el-menu-item index="5-1">数据报表</el-menu-item>
 
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </el-aside>
</el-aside>


            <el-main class="main">

                <router-view></router-view>

            </el-main>

        </el-container>

    </el-container>


</template>

<script>
    export default {

        // 在首页渲染之前 进行判断
        //登陆验证
        //钩子函数数据观测 (data observer) 和 event/watcher 事件配置之前被调用
        //因为router使用了导航守卫所以这里不与要判断了
        beforeCreate() {
            // const token =sessionStorage.getItem('token')
            // if(!token){
            //     this.$message.warning('请先登陆')
            //     this.$router.push('/login')
            // }
        },
        methods:{
          // 退出功能
           handleSignout(){
          // 清除session
           sessionStorage.clear()
           // 回到登录页
             this.$router.push({name:'login'})
         // 提示框
          this.$message.warning('退出成功')
  }
}
    }
</script>

<style>
 .header .middle{
    line-height: 60px;
    color: #fff;
    text-align: center;
  }
  .header .loginout{
    line-height: 60px;
    text-decoration: none;
  }
    .container {
        height: 100%;
    }      
    .header {
        background-color: #b3c0d1;
    }
    .aside {
        background-color: #d3dce6;
    }
    .main {
        background-color: #e9eef3;
        height: 100%;
    }
</style>
