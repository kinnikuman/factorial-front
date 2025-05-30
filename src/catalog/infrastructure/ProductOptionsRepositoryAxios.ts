import axios, { AxiosError } from 'axios'
import { ProductOption } from '../domain/ProductOption'
import { ProductOptionsRepository } from '../domain/ProductOptionsRepository'

export class ProductOptionsRepositoryAxios implements ProductOptionsRepository {
  private readonly baseUrl = 'http://localhost:3000/api'

  async getConfigurableOptions(productType: string): Promise<ProductOption[]> {
    try {
      const response = await axios.get<any[]>(
        `${this.baseUrl}/configurable-options/${productType}`
      )
      
      if (!Array.isArray(response.data)) {
        throw new Error('API response does not have the expected format');
      }
      
      // Group options by type
      const optionsByType: Record<string, any[]> = {};
      
      // Group options by type
      response.data.forEach((option) => {
        if (!option.type) {
          console.warn('Opción sin tipo:', option);
          return;
        }
        
        if (!optionsByType[option.type]) {
          optionsByType[option.type] = [];
        }
        
        optionsByType[option.type].push(option);
      });
      
      
      // Convert to the expected ProductOption[] structure
      const result: ProductOption[] = Object.entries(optionsByType).map(([type, options]) => {
        return {
          id: `${type}_group`,
          type: type as any,
          name: this.getOptionTypeName(type),
          values: options.map(opt => ({
            id: opt.id,
            name: opt.name,
            price: opt.price,
            restrictions: opt.restrictions
          }))
        };
      });
      
      return result;
      
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.status === 404) {
          return [];
        }
      }
      throw new Error('Error al cargar las opciones configurables');
    }
  }

  private getOptionTypeName(type: string): string {
    const typeNames: Record<string, string> = {
      'frame': 'Cuadro',
      'wheels': 'Ruedas',
      'rim_color': 'Color de llanta',
      'chain': 'Cadena',
      'finish': 'Acabado'
    };
    
    return typeNames[type] || type;
  }
}
