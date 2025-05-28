import { Product } from './Product'

export interface ProductRepository {
  findAll(): Promise<Product[]>
  findById(id: number): Promise<Product>
}
