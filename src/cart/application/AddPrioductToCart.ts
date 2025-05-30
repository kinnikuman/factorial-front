import { SelectedOptions } from '../../catalog/domain/ProductOption'
import { AddProductToCartWriteModel } from './AddProductToCartWriteModel'

export class AddProductToCart {
  constructor(private writemodel: AddProductToCartWriteModel) {}

  async execute(productId: string, selectedOptions: SelectedOptions): Promise<void> {
    return this.writemodel.addProduct(productId, selectedOptions)
  }
}
