import axios, { AxiosError } from 'axios'
import { Product } from '../domain/Product'
import { ProductRepository } from '../domain/Repository'

export class ProductRepositoryAxios implements ProductRepository {
  private readonly baseUrl = 'http://localhost:3000/api'

  async findAll(): Promise<Product[]> {
    try {
      const response = await axios.get<Product[]>(`${this.baseUrl}/products`)
      return response.data
    } catch (err) {
      throw new Error(err instanceof AxiosError ? err.message : 'An error occurred')
    }
  }

  async findById(id: number): Promise<Product> {
    try {
      const response = await axios.get<Product>(`${this.baseUrl}/products/${id}`)
      return response.data
    } catch (err) {
      throw new Error(err instanceof AxiosError ? err.message : 'An error occurred')
    }
  }
}
