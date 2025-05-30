import { Product } from '../domain/Product'
import { ProductRepository } from '../domain/Repository'

export class GetProduct {

  constructor(private repository: ProductRepository) {}

  async execute(productId: string): Promise<Product> {
      return this.repository.findById(productId)
  }
}
