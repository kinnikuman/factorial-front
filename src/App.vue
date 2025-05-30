<template>
  <div class="app-container">
    <header class="app-header">
      <nav>
        <button @click="currentView = 'home'" :class="{ active: currentView === 'home' }">
          Home
        </button>
        <button @click="currentView = 'products'" :class="{ active: currentView === 'products' }">
          Products
        </button>
        <button @click="currentView = 'cart'" :class="{ active: currentView === 'cart' }">
          Cart
        </button>
      </nav>
    </header>
    <main>
      <div v-if="currentView === 'home'">
        <HomeView />
      </div>
      <div v-else-if="currentView === 'products'">
        <ProductsView @edit-product="handleEditProduct" />
      </div>
      <div v-else-if="currentView === 'cart'">
        <CartView />
      </div>
      <div v-else-if="currentView === 'edit-product'">
        <ProductEdit :product-id="editingProductId" @back="currentView = 'products'" />
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import HomeView from './views/Home.vue'
import ProductsView from './views/Products.vue'
import CartView from './views/Cart.vue'
import ProductEdit from './views/ProductEdit.vue'

const currentView = ref('home')
const editingProductId = ref<number | null>(null)

const handleEditProduct = (productId: number) => {
  editingProductId.value = productId
  currentView.value = 'edit-product'
}
</script>

<style>
.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.app-header {
  padding: 1rem;
  background-color: #f5f5f5;
  margin-bottom: 2rem;
  border-radius: 8px;
}

nav {
  display: flex;
  gap: 1rem;
  padding: 0.5rem 1rem;
}

nav button {
  background: none;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 1rem;
  color: #333;
  font-weight: 500;
  border-radius: 4px;
  transition: all 0.2s ease;
}

nav button:hover {
  background-color: #e9e9e9;
}

nav button.active {
  color: white;
  background-color: #42b983;
}
</style>
