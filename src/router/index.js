import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Products from '../views/Products.vue'
import Cart from '../views/Cart.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/products',
    name: 'products',
    component: Products
  },
  {
    path: '/products/:id/edit',
    name: 'product-edit',
    component: () => import('../views/ProductEdit.vue')
  },
  {
    path: '/cart',
    name: 'cart',
    component: Cart
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
