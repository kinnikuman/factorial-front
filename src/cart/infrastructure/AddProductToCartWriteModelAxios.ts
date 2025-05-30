import axios, { AxiosError } from 'axios'
import { SelectedOptions } from '../../catalog/domain/ProductOption'
import { AddProductToCartWriteModel } from '../application/AddProductToCartWriteModel'

export class AddProductToCartWriteModelAxios implements AddProductToCartWriteModel {
  private readonly baseUrl = 'http://localhost:3000/api'
  private readonly storageKey = 'factorial_cart_id'

  async addProduct(productId: string, selectedOptions: SelectedOptions): Promise<void> {
    try {
      // Get cart ID from local storage or generate a new one
      let cartId = localStorage.getItem(this.storageKey)
      
      // If no cart ID exists, generate a new one
      if (!cartId) {
        cartId = this.generateUUID()
        localStorage.setItem(this.storageKey, cartId)
      }
      
      // Convert selectedOptions object to array of option IDs
      const selectedOptionsArray = Object.values(selectedOptions).filter(Boolean) as string[]
      
      // Prepare request payload
      const payload = {
        cart_id: cartId,
        product_id: productId,
        selected_options: selectedOptionsArray
      }
      
      // Send request to add product to cart
      await axios.post(`${this.baseUrl}/cart/item`, payload)
    } catch (err) {
      if (err instanceof AxiosError) {
        console.error('Error adding product to cart:', err.response?.data || err.message)
      } else {
        console.error('Error adding product to cart:', err)
      }
      throw new Error('Failed to add product to cart')
    }
  }
  
  // Generate a UUID v4
  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0
      const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }
}
