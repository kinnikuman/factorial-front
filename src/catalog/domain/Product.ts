export interface Product {
  id: string
  name: string
  price: number
  image: string
  description: string | undefined
  type: string | undefined
  options: string[] | undefined
}