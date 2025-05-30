export interface ProductOptionValue {
  id: string
  name: string
  price?: number
  restrictions?: string[] // IDs de opciones con las que no es compatible
}

export interface ProductOption {
  id: string
  type: 'frame' | 'wheels' | 'rim_color' | 'chain' | 'finish'
  name: string
  values: ProductOptionValue[]
}

export interface SelectedOptions {
  frame?: string
  wheels?: string
  rim_color?: string
  chain?: string
  finish?: string
  [key: string]: string | undefined
}