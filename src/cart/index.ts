import { AddProductToCart } from './application/AddPrioductToCart'
import { AddProductToCartWriteModelAxios } from './infrastructure/AddProductToCartWriteModelAxios'

export const cart = {
  addProductToCart: new AddProductToCart(new AddProductToCartWriteModelAxios())
}