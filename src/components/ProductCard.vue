<template>
  <div class="product-card">
    <img :src="product.image" :alt="product.name" class="product-image" />
    <h3>{{ product.name }}</h3>
    <p class="product-price">${{ product.price }}</p>
    <button @click="configureProduct" class="edit-button">
      Configure
    </button>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue'

const emit = defineEmits(['edit'])

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const configureProduct = () => {
  emit('edit', props.product.id)
}
</script>

<style scoped>
.product-card {
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.2s;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 16px;
}

.product-price {
  font-size: 1.2em;
  color: #2c3e50;
  margin: 8px 0;
}

.edit-button {
  display: inline-block;
  padding: 8px 16px;
  background-color: #3498db;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  margin-top: 16px;
  transition: background-color 0.2s;
}

.edit-button:hover {
  background-color: #2980b9;
}
</style>
