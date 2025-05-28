import { ListProducts } from './application/ListProducts'
import { ProductRepositoryAxios } from './infrastructure/ProductRepositoryAxios'

export const catalog = {
  repository: new ProductRepositoryAxios(),
  listProducts: new ListProducts(new ProductRepositoryAxios())
}
