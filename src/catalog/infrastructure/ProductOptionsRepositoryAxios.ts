import axios, { AxiosError } from 'axios'
import { ProductOption } from '../domain/ProductOption'
import { ProductOptionsRepository } from '../domain/ProductOptionsRepository'

export class ProductOptionsRepositoryAxios implements ProductOptionsRepository {
  private readonly baseUrl = 'http://localhost:3000/api'

  async getConfigurableOptions(productType: string): Promise<ProductOption[]> {
    try {
      const response = await axios.get<ProductOption[]>(
        `${this.baseUrl}/configurable-options/${productType}`
      )
      return response.data
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.status === 404) {
          console.warn(`No se encontraron opciones configurables para el tipo: ${productType}`)
          return []
        }
      }
      console.error('Error al obtener las opciones configurables:', err)
      throw new Error('Error al cargar las opciones configurables')
    }
  }
}
