<template>
<!-- 全局组件，面包屑 -->
     <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{text1}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{text2}}</el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
export default {
    name:'myBread',
    props:['text1','text2']
}
</script>

<style>

</style>
