export type GetCategory = {
  id: number
  category: string
}

export type CreateSpend = {
  date: string
  category_id: number | null
  price: number | null
  fixed_cost: boolean
  deferred_pay: boolean
  memo: string
}

export type GetSpend = {
  date: string
  category: string
  price: number
  fixed_cost: boolean
  deferred_pay: boolean
  memo: string
}

export type ModalParams = {
  status: boolean
  class: string
  message: string
}
