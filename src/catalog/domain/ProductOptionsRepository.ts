import { ProductOption } from './ProductOption'

export interface ProductOptionsRepository {
  getConfigurableOptions(productType: string): Promise<ProductOption[]>
}
