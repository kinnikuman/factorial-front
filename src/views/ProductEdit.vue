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
        <div v-if="configurableOptions.length > 0" class="product-options">
          <h2>Configure your bicycle</h2>
          
          <!-- Selector for each option type -->
          <div class="option-group" v-if="hasOptionType('frame')">
            <label for="frame">Frame</label>
            <select 
              id="frame" 
              v-model="selectedOptions.frame"
              @change="updateOptions('frame', $event.target.value || null)"
              class="option-select"
            >
              <option value="">Select a frame</option>
              <option 
                v-for="value in getOptionValues('frame')" 
                :key="value.id" 
                :value="value.id"
                :disabled="!isOptionAvailable('frame', value.id)"
              >
                {{ value.name }} {{ value.price ? `(+${value.price}€)` : '' }}
              </option>
            </select>
          </div>

          <div class="option-group" v-if="hasOptionType('wheels')">
            <label for="wheels">Wheels</label>
            <select 
              id="wheels"
              v-model="selectedOptions.wheels"
              @change="updateOptions('wheels', $event.target.value || null)"
              class="option-select"
            >
              <option value="">Select wheels</option>
              <option 
                v-for="value in getOptionValues('wheels')" 
                :key="value.id" 
                :value="value.id"
                :disabled="!isOptionAvailable('wheels', value.id)"
              >
                {{ value.name }} {{ value.price ? `(+${value.price}€)` : '' }}
              </option>
            </select>
          </div>

          <div class="option-group" v-if="hasOptionType('rim_color')">
            <label for="rim_color">Rim Color</label>
            <select 
              id="rim_color"
              v-model="selectedOptions.rim_color"
              @change="updateOptions('rim_color', $event.target.value || null)"
              class="option-select"
            >
              <option value="">Select a color</option>
              <option 
                v-for="value in getOptionValues('rim_color')" 
                :key="value.id" 
                :value="value.id"
                :disabled="!isOptionAvailable('rim_color', value.id)"
              >
                {{ value.name }} {{ value.price ? `(+${value.price}€)` : '' }}
              </option>
            </select>
          </div>


          <div class="option-group" v-if="hasOptionType('chain')">
            <label for="chain">Chain</label>
            <select 
              id="chain"
              v-model="selectedOptions.chain"
              @change="updateOptions('chain', $event.target.value || null)"
              class="option-select"
            >
              <option value="">Select a chain</option>
              <option 
                v-for="value in getOptionValues('chain')" 
                :key="value.id" 
                :value="value.id"
                :disabled="!isOptionAvailable('chain', value.id)"
              >
                {{ value.name }} {{ value.price ? `(+${value.price}€)` : '' }}
              </option>
            </select>
          </div>

          <div class="option-group" v-if="hasOptionType('finish')">
            <label for="finish">Finish</label>
            <select 
              id="finish"
              v-model="selectedOptions.finish"
              @change="updateOptions('finish', $event.target.value || null)"
              class="option-select"
            >
              <option value="">Select a finish</option>
              <option 
                v-for="value in getOptionValues('finish')" 
                :key="value.id" 
                :value="value.id"
                :disabled="!isOptionAvailable('finish', value.id)"
              >
                {{ value.name }} {{ value.price ? `(+${value.price}€)` : '' }}
              </option>
            </select>
          </div>
        </div>

        <div class="product-actions">
          <button @click="addToCart" class="add-to-cart-button">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { catalog } from '../catalog'
import { cart } from '../cart'
import { ProductOption, SelectedOptions } from '../catalog/domain/ProductOption'
import { ProductOptionsService } from '../catalog/domain/services/ProductOptionsService'

const route = useRoute()
const router = useRouter()
const productId = route.params.id as string
const product = ref<ProductState>({
  id: '',
  name: 'Loading...',
  description: '',
  price: 0,
  image: '',
  type: '',
  options: []
});

interface ProductState {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  type: string;
  options: any[];
}

const configurableOptions = ref<ProductOption[]>([]);
const selectedOptions = ref<SelectedOptions>({});
const optionsService = ref<ProductOptionsService | null>(null);

// Verifica si existe un tipo de opción
function hasOptionType(optionType: string): boolean {
  if (!Array.isArray(configurableOptions.value)) {
    console.warn('configurableOptions no es un array');
    return false;
  }
  
  const exists = configurableOptions.value.some(option => {
    if (!option) return false;
    return option.type === optionType;
  });
  
  console.log(`¿Existe ${optionType}?`, exists);
  return exists;
}

// Obtiene los valores para un tipo de opción específico
function getOptionValues(optionType: string): ProductOptionValue[] {
  if (!optionsService.value) {
    console.warn('El servicio de opciones no está inicializado');
    return [];
  }
  
  // Buscar directamente en las opciones configurables
  const option = configurableOptions.value.find(opt => opt.type === optionType);
  if (!option || !Array.isArray(option.values)) {
    console.warn(`No se encontró la opción ${optionType} o no tiene valores`);
    return [];
  }
  
  // Filtrar valores disponibles según restricciones
  const availableValues = option.values.filter(value => {
    if (!value || !value.id) return false;
    
    // Si es la opción actualmente seleccionada, siempre mostrarla
    if (selectedOptions.value[optionType] === value.id) {
      return true;
    }
    
    // Verificar restricciones
    return isOptionAvailable(optionType, value.id);
  });
  
  return availableValues;
}

// Verifica si una opción específica está disponible
function isOptionAvailable(optionType: string, valueId: string): boolean {
  if (!optionType || !valueId) return false;
  
  // Buscar la opción en las opciones configurables
  const option = configurableOptions.value.find(opt => opt.type === optionType);
  if (!option || !Array.isArray(option.values)) return false;
  
  // Buscar el valor específico
  const value = option.values.find(v => v && v.id === valueId);
  if (!value) return false;
  
  // Verificar restricciones en ambas direcciones
  for (const [type, selectedId] of Object.entries(selectedOptions.value)) {
    // Ignorar la opción que estamos evaluando
    if (type === optionType) continue;
    
    // Si no hay un valor seleccionado para este tipo, continuar
    if (!selectedId) continue;
    
    // 1. Verificar si la opción seleccionada está en las restricciones del valor actual
    if (value.restrictions && Array.isArray(value.restrictions) && value.restrictions.includes(selectedId)) {
      return false;
    }
    
    // 2. Verificar si el valor actual está en las restricciones de la opción seleccionada
    const selectedOption = configurableOptions.value.find(opt => opt.type === type);
    if (!selectedOption || !Array.isArray(selectedOption.values)) continue;
    
    const selectedValue = selectedOption.values.find(v => v && v.id === selectedId);
    if (!selectedValue) continue;
    
    if (selectedValue.restrictions && Array.isArray(selectedValue.restrictions) && 
        selectedValue.restrictions.includes(valueId)) {
      return false;
    }
  }
  
  return true;
}

// Actualizar opciones cuando cambia una selección
function updateOptions(optionType: string, valueId: string | null) {
  if (!optionsService.value || !optionType) return;
  
    const newOptions = optionsService.value.updateOptions(optionType, valueId);
    if (newOptions) {
      // Actualizamos solo la opción que cambió
      selectedOptions.value = { 
        ...selectedOptions.value,
        [optionType]: valueId || undefined 
      };
      optionsService.value.updateSelectedOptions(selectedOptions.value);
    }
}

// Inicializar las opciones seleccionadas desde las opciones del producto
function initSelectedOptions() {
  if (!product.value?.options || !Array.isArray(product.value.options) || !optionsService.value) {
    return;
  }
  
  const initialOptions: SelectedOptions = {};
  const productOptions = product.value.options;
  
  // Para cada opción del producto, buscar a qué tipo pertenece
  productOptions.forEach(optionId => {
    // Buscar en cada opción configurable
    configurableOptions.value.forEach(configOption => {
      if (!configOption.values) return;
      
      // Buscar si el ID de la opción del producto está en los valores de esta opción configurable
      const found = configOption.values.some(value => value.id === optionId);
      
      if (found) {
        initialOptions[configOption.type] = optionId;
      }
    });
  });
  
  selectedOptions.value = initialOptions;
  
  // Actualizar el servicio con las opciones seleccionadas
  optionsService.value.updateSelectedOptions(initialOptions);
}

onMounted(async () => {
  try {
    // Cargar detalles del producto
    const productData = await catalog.getProduct.execute(productId);
    product.value = productData;
    
    // Cargar opciones configurables si el producto tiene un tipo
    if (product.value.type) {
      try {
        const options = await catalog.productOptions.execute(product.value.type);
        
        configurableOptions.value = options;
        
        // Inicializar el servicio de opciones
        optionsService.value = new ProductOptionsService(options);
        
        // Inicializar las opciones seleccionadas desde el producto
        if (product.value.options && product.value.options.length > 0) {
          initSelectedOptions();
        } else {
          selectedOptions.value = {};
        }
      } catch (error) {
        console.error('Error al cargar las opciones configurables:', error);
      }
    }
  } catch (error) {
    console.error('Error al cargar los detalles del producto:', error);
  }
});

async function addToCart() {
  try {
    // Add the product to the cart using the cart service
    await cart.addProductToCart.execute(product.value.id, selectedOptions.value);
    
    // Navigate to a success page or show a success message
    alert('Product added to cart successfully!');
    
    // Optionally navigate to the cart page
    // router.push('/cart');
  } catch (error) {
    console.error('Error adding product to cart:', error);
    alert('Failed to add product to cart. Please try again.');
  }
}
</script>

<style scoped>
.product-edit {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.product-options {
  margin: 2rem 0;
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.product-options h2 {
  margin-bottom: 1.5rem;
  color: #2c3e50;
  font-size: 1.5rem;
}

.option-group {
  margin-bottom: 1.5rem;
}

.option-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #34495e;
}

.option-select {
  width: 100%;
  max-width: 400px;
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  color: #2c3e50;
  background-color: white;
  transition: border-color 0.2s ease;
}

.option-select:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.option-select option:disabled {
  color: #bdc3c7;
  background-color: #f8f9fa;
}

.option-select option:not(:disabled) {
  color: #2c3e50;
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
