import { ListProducts } from './application/ListProducts'
import { ProductRepositoryAxios } from './infrastructure/ProductRepositoryAxios'
import { GetProduct } from './application/GetProduct'

export const catalog = {
  repository: new ProductRepositoryAxios(),
  listProducts: new ListProducts(new ProductRepositoryAxios()),
  getProduct: new GetProduct(new ProductRepositoryAxios())
}
