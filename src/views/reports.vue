<template>
     <el-card>
          <!-- 面包屑 -->
     <myBread text1="数据统计" text2="数据报表" ></myBread>

        <!-- vue中的选择器ref    获取时$refs -->
     <div id="main" ref="main" style="width: 600px;height:400px;"></div>
     </el-card>
</template>

<script>
import echarts from 'echarts'

export default {
    mounted(){
         this.useEcharts()
    },
    methods: {
         async useEcharts() {
               const myChart = echarts.init(this.$refs.main)

                 const arr2 = {
                 title: {
                   text: '堆叠区域图'
                 },
                 tooltip: {
                   trigger: 'axis',
                   axisPointer: {
                     type: 'cross',
                     label: {
                       backgroundColor: '#6a7985'
                     }
                   }
                 },

                 toolbox: {
                   feature: {
                     saveAsImage: {}
                   }
                 },
                 grid: {
                   left: '3%',
                   right: '4%',
                   bottom: '3%',
                   containLabel: true
                 }

            }

             const res = await this.$http.get(`reports/type/1`)
             console.log(res)
             const arr1=res.data.data

            const option ={...arr1,...arr2}
             myChart.setOption(option);  
         }
    }
}
</script>

<style>

</style>
