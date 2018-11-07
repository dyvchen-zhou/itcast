import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/views/login.vue'
import Home from '@/views/home.vue'
import Users from '@/views/users.vue'
import Rights from '@/views/rights.vue'
import Role from '@/views/role.vue'
import Goodscate from '@/views/goodscate.vue'
import Goodslist from '@/views/goodslist.vue'
import Goodsadd from '@/views/Goodsadd.vue'

Vue.use(Router)

const router = new Router({
    routes: [{
        name: 'home',
        path: '/',
        component: Home,
        //设置成子路由上
        children: [
            { path: '/users', component: Users },
            { path: '/rights', component: Rights },
            { path: '/role', component: Role },
            { path: '/goodscate', component: Goodscate },
            { path: '/goodslist', component: Goodslist },
            { path: '/goodsadd', component: Goodsadd }
        ]
    }, {
        name: 'login',
        path: '/login',
        component: Login
    }]
})

//导航守卫
//在导航生效前 会先来到下面这个方法
router.beforeEach((to, from, next) => {
    if (to.path === '/login') {
        next()
    } else {
        const token = sessionStorage.getItem('token')
        if (!token) {
            // 如果要去的不是登录组件并且没有token,就跳转到登录组件
            //js方法改动url
            router.push('/login')
            return
        }
        //如果要去的不是登录组件并且有token
        next()
    }
})

export default router