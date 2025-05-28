<template>
  <div class="product-edit">
    <h1>Configure Bike {{ productId }}</h1>
    <!-- Esta página será implementada más adelante -->
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const productId = route.params.id
</script>

<style scoped>
.product-edit {
  padding: 20px;
}
</style>
