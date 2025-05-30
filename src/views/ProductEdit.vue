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

// Check if an option type exists
function hasOptionType(optionType: string): boolean {
  if (!Array.isArray(configurableOptions.value)) {
    console.warn('configurableOptions is not an array');
    return false;
  }
  
  const exists = configurableOptions.value.some(option => {
    if (!option) return false;
    return option.type === optionType;
  });
  
  return exists;
}

// Get values for a specific option type
function getOptionValues(optionType: string): ProductOptionValue[] {
  if (!optionsService.value) {
    console.warn('Options service is not initialized');
    return [];
  }
  
  // Search directly in the configurable options
  const option = configurableOptions.value.find(opt => opt.type === optionType);
  if (!option || !Array.isArray(option.values)) {
    console.log(`Does ${optionType} exist?`, exists); 
    console.log(`Option ${optionType} not found or has no values`);
    return [];
  }
  
  // Filter available values according to restrictions
  const availableValues = option.values.filter(value => {
    if (!value || !value.id) return false;
    
    // If it's the currently selected option, always show it
    if (selectedOptions.value[optionType] === value.id) {
      return true;
    }
    
    // Check restrictions
    return isOptionAvailable(optionType, value.id);
  });
  
  return availableValues;
}

// Check if a specific option is available
function isOptionAvailable(optionType: string, valueId: string): boolean {
  if (!optionType || !valueId) return false;
  
  // Find the option in the configurable options
  const option = configurableOptions.value.find(opt => opt.type === optionType);
  if (!option || !Array.isArray(option.values)) return false;
  
  // Find the specific value
  const value = option.values.find(v => v && v.id === valueId);
  if (!value) return false;
  
  // Check restrictions in both directions
  for (const [type, selectedId] of Object.entries(selectedOptions.value)) {
    // Ignore the option we're evaluating
    if (type === optionType) continue;
    
    // If there's no selected value for this type, continue
    if (!selectedId) continue;
    
    // 1. Check if the selected option is in the current value's restrictions
    if (value.restrictions && Array.isArray(value.restrictions) && value.restrictions.includes(selectedId)) {
      return false;
    }
    
    // 2. Check if the current value is in the selected option's restrictions
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

// Update options when a selection changes
function updateOptions(optionType: string, valueId: string | null) {
  if (!optionsService.value || !optionType) return;
  
    const newOptions = optionsService.value.updateOptions(optionType, valueId);
    if (newOptions) {
      // Update only the changed option
      selectedOptions.value = { 
        ...selectedOptions.value,
        [optionType]: valueId || undefined 
      };
      optionsService.value.updateSelectedOptions(selectedOptions.value);
    }
}

// Initialize selected options from product options
function initSelectedOptions() {
  if (!product.value?.options || !Array.isArray(product.value.options) || !optionsService.value) {
    return;
  }
  
  const initialOptions: SelectedOptions = {};
  const productOptions = product.value.options;
  
  // For each product option, find which type it belongs to
  productOptions.forEach(optionId => {
    // Search through each configurable option
    configurableOptions.value.forEach(configOption => {
      if (!configOption.values) return;
      
      // Check if the product option ID is in the values of this configurable option
      const found = configOption.values.some(value => value.id === optionId);
      
      if (found) {
        initialOptions[configOption.type] = optionId;
      }
    });
  });
  
  selectedOptions.value = initialOptions;
  
  // Update the service with the selected options
  optionsService.value.updateSelectedOptions(initialOptions);
}

onMounted(async () => {
  try {
    // Load product details
    const productData = await catalog.getProduct.execute(productId);
    product.value = productData;
    
    // Load configurable options if the product has a type
    if (product.value.type) {
      try {
        const options = await catalog.productOptions.execute(product.value.type);
        
        configurableOptions.value = options;
        
        // Initialize the options service
        optionsService.value = new ProductOptionsService(options);
        
        // Initialize selected options from the product
        if (product.value.options && product.value.options.length > 0) {
          initSelectedOptions();
        } else {
          selectedOptions.value = {};
        }
      } catch (error) {
        console.error('Error loading configurable options:', error);
      }
    }
  } catch (error) {
    console.error('Error loading product details:', error);
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
