<template>
  <div class="product-edit">
    <div class="product-container">
      <div class="product-image">
        <img :src="product.image" :alt="product.name" />
      </div>
      <div class="product-details">
        <h1>{{ product.name }}</h1>
        <div class="product-price">
          <span class="price">{{ product.price }} €</span>
        </div>
        <div class="product-description">
          <p>{{ product.description }}</p>
        </div>
        <div class="product-actions">
          <button @click="saveProduct" class="save-button">
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { catalog } from '../catalog'

const route = useRoute()
const productId = route.params.id
const product = ref({
  id: '',
  name: 'Loading...',
  description: '',
  price: 0,
  image: '',
  type: '',
  options: []
});

const configurableOptions = ref([]);

onMounted(async () => {
  try {
    const productData = await catalog.getProduct.execute(productId)
    product.value = productData

    if (product.value.type) {
      try {
        const options = await catalog.productOptions.execute(product.value.type)
        configurableOptions.value = options

        console.log(configurableOptions)
      } catch (error) {
        console.warn('No se pudieron cargar las opciones configurables:', error)
      }
    }
  } catch (error) {
    console.error('Error al cargar los detalles del producto:', error)
  }
})

const saveProduct = () => {
  // Aquí iría la lógica para guardar los cambios del producto
  console.log('Guardando producto:', product.value)
  // En una aplicación real, aquí se haría una llamada API para guardar los cambios
}
</script>

<style scoped>
.product-edit {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.product-container {
  display: flex;
  gap: 3rem;
  align-items: flex-start;
}

.product-image {
  flex: 1;
}

.product-image img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.product-details {
  flex: 1;
}

.product-details h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #333;
}

.product-price {
  margin-bottom: 2rem;
}

.product-price .price {
  font-size: 2rem;
  font-weight: bold;
  color: #2ecc71;
}

.product-description {
  margin-bottom: 2rem;
  line-height: 1.6;
  color: #666;
}

.product-actions {
  display: flex;
  gap: 1rem;
}

.save-button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 5px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.save-button:hover {
  background-color: #2980b9;
}

@media (max-width: 768px) {
  .product-container {
    flex-direction: column;
    gap: 2rem;
  }
  
  .product-image {
    max-width: 100%;
  }
  
  .product-details h1 {
    font-size: 2rem;
  }
  
  .product-price .price {
    font-size: 1.8rem;
  }
}
</style>
