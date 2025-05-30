import { Product } from './Product'

export interface ProductRepository {
  findAll(): Promise<Product[]>
  findById(id: string): Promise<Product>
}
