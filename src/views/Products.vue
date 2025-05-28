<template>
  <div class="products-container">
    <h1>Products</h1>
    <div class="products-list">
      <ProductCard v-for="product in products" :key="product.id" :product="product" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ProductCard from '../components/ProductCard.vue'

const products = ref([
  {
    id: 1,
    name: 'Bike 1',
    price: 99.99,
    image: 'https://via.placeholder.com/400x300?text=Producto+1'
  },
  {
    id: 2,
    name: 'Bike 2',
    price: 149.99,
    image: 'https://via.placeholder.com/400x300?text=Producto+2'
  },
  {
    id: 3,
    name: 'Bike 3',
    price: 79.99,
    image: 'https://via.placeholder.com/400x300?text=Producto+3'
  }
])
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
</style>
