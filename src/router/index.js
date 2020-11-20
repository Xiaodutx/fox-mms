import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login'
import Layout from '@/components/Layout'
import Home from '@/views/home'
import Goods from '@/views/goods'
import Member from '@/views/member'
import Staff from '@/views/staff'
import Supplier from '@/views/supplier'

Vue.use(VueRouter)

const routes = [{
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/',
    name: 'layout',
    redirect: '/home',
    component: Layout,
    children: [
      {
        path: '/home',
        name: 'home',
        component: Home,
        meta: {title: '首页'}
      }, 
      {
        path: '/goods',
        name: 'goods',
        component: Goods,
        meta: {title: '商品管理'}
      },
      {
        path: '/member',
        name: 'member',
        component: Member,
        meta: {title: '会员管理'}
      },      
    ]
  },
  {
    path: '/staff',
    component: Layout,
    children: [
      {
        path: '/',
        component: Staff,
        meta: {title: '员工管理'}
      }
    ]
  },
  {
    path: '/supplier',
    component: Layout,
    children: [
      {
        path: '/',
        component: Supplier,
        meta: {title: '供应商管理'}
      }
    ]
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router