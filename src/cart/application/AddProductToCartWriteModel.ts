import { SelectedOptions } from '../../catalog/domain/ProductOption'

export interface AddProductToCartWriteModel {
  addProduct(productId: string, selectedOptions: SelectedOptions): Promise<void>
}
