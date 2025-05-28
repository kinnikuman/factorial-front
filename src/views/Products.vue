<template>
  <div class="products-container">
    <h1>Products</h1>
    <div v-if="loading" class="loading-spinner">
      <div class="spinner"></div>
    </div>
    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>
    <div v-else class="products-list">
      <ProductCard v-for="product in products" :key="product.id" :product="product" />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import ProductCard from '../components/ProductCard.vue'
import { catalog } from '../catalog'

const { products, loading, error } = catalog.listProducts.state

onMounted(() => {
  catalog.listProducts.execute()
})
</script>

<style scoped>
.products-container {
  padding: 20px;
}

.products-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  color: #e74c3c;
  text-align: center;
  padding: 20px;
  background-color: #f9f2f2;
  border-radius: 4px;
}
</style>
