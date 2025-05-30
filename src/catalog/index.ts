import { ListProducts } from './application/ListProducts'
import { ProductRepositoryAxios } from './infrastructure/ProductRepositoryAxios'
import { GetProduct } from './application/GetProduct'
import { ProductOptionsRepositoryAxios } from './infrastructure/ProductOptionsRepositoryAxios'
import { GetProductOptions } from './application/GetProductOptions'

export const catalog = {
  repository: new ProductRepositoryAxios(),
  listProducts: new ListProducts(new ProductRepositoryAxios()),
  getProduct: new GetProduct(new ProductRepositoryAxios()),
  productOptions: new GetProductOptions(new ProductOptionsRepositoryAxios())
}
