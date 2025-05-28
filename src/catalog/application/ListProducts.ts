import { ref } from 'vue'
import { Product } from '../domain/Product'
import { ProductRepository } from '../domain/Repository'

export class ListProducts {
  private products = ref<Product[]>([])
  private loading = ref(false)
  private error = ref<string | null>(null)

  constructor(private repository: ProductRepository) {}

  async execute(): Promise<void> {
    try {
      this.loading.value = true
      this.error.value = null
      this.products.value = await this.repository.findAll()
    } catch (err) {
      this.error.value = err instanceof Error ? err.message : 'An error occurred'
    } finally {
      this.loading.value = false
    }
  }

  get state() {
    return {
      products: this.products,
      loading: this.loading,
      error: this.error
    }
  }
}
