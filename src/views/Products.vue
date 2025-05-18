<template>
  <div class="products-container">
    <h1>Products</h1>
    <div class="products-list">
      <!-- Aquí irán los productos -->
    </div>
  </div>
</template>

<script setup>
// Componente de productos
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
