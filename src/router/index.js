import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Heartrate from '../views/Heartrate.vue'
import Select from '../views/Select.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/heartrate/:type',
    name: 'Heartrate',
    component: Heartrate
  },
  {
    path: '/select',
    name: 'Select',
    component: Select
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  routes
  // mode: 'abstract'
})

export default router
