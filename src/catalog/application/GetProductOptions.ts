import { ProductOption } from '../domain/ProductOption'
import { ProductOptionsRepository } from '../domain/ProductOptionsRepository'

export class GetProductOptions {

  constructor(private repository: ProductOptionsRepository) {}

  async execute(productType: string): Promise<ProductOption[]> {
      return this.repository.getConfigurableOptions(productType)
  }
}
