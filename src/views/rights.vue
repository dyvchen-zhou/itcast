<template>
    <el-card class="box-card">
        <!-- 面包屑 -->
        <myBread text1="权限管理" text2="权限列表" ></myBread>

        <el-table
    :data="list"
    border
    class="list-card"
    style="width: 100%"  height="500">
    <el-table-column
      type="index"
      label="#"
      width="80">
    </el-table-column>

    <el-table-column
      prop="authName"
      label="权限名称"
      width="180">
    </el-table-column>

    <el-table-column 
      prop="path" 
      label="路径" 
      width="120">
    </el-table-column>

    <el-table-column 
      label="层级" 
      width="120">
       <template slot-scope="scope">
      <span v-if="scope.row.level==='0'">一级</span>
      <span v-if="scope.row.level==='1'">二级</span>
      <span v-if="scope.row.level==='2'">三级</span>      
      </template>
    </el-table-column>
  </el-table>
    </el-card>
</template>

<script>
export default {
    data(){
        return{
            list:[]
        }
    },
    created(){
        this.loadTableData()
    },
    methods: {
        async loadTableData() {
            const res = await this.$http.get(`rights/list`)
            console.log(res)

            this.list = res.data.data
            console.log(this.list);
            

        }
    }



    
}
</script>

<style>
    .list-card{
        margin-top: 20px;
    }
</style>
