export type GetCategory = {
  id: number
  category: string
  initial_flag: boolean
  spend_target_value: number
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
  id: number
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
  apply_button_message: string | undefined
  close_button_message: string | undefined
}

export type SpendCategoryTotal = {
  name: string
  price: number
  target_value: number
  difference_value: number
}
