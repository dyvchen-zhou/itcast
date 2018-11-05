// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

import MyBread from '@/components/myBread.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/css/index.css'

import router from './router'
import HttpTool from './plugins/http'
import moment from 'moment'
// 全局过滤器
// 格式化日期
Vue.filter('fmtDate', (value, fmtString) => {
    return moment(value).format(fmtString)
})


// 定义全局面包屑组件
Vue.component(MyBread.name, MyBread)


Vue.use(ElementUI)
Vue.use(HttpTool)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
})