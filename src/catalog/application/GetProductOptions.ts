import { ProductOptions } from '../domain/Product'
import { ProductOptionsRepository } from '../domain/ProductOptionsRepository'

export class GetProductOptions {

  constructor(private repository: ProductOptionsRepository) {}

  async execute(productType: string): Promise<ProductOptions> {
      return this.repository.getConfigurableOptions(productType)
  }
}
