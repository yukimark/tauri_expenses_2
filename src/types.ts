export type GetCategory = {
  id: number;
  category: string;
  initial_flag: boolean;
  spend_target_value: number;
};

export type CreateSpend = {
  date: string;
  category_id: number | null;
  price: number | null;
  fixed_cost: boolean;
  deferred_pay: boolean;
  memo: string;
};

export type GetSpend = {
  id: number;
  date: string;
  category: string;
  price: number;
  fixed_cost: boolean;
  deferred_pay: boolean;
  memo: string;
};

export type GetSpendQuery = {
  id: number;
  date: string;
  category: string;
  price: number;
  fixed_cost: number;
  deferred_pay: number;
  memo: string;
};

export type ModalParams = {
  status: boolean;
  class: string;
  message: string;
  apply_button_message?: string;
  close_button_message?: string;
};

export type SpendCategoryTotal = {
  name: string;
  price: number;
  target_value: number;
  difference_value: number;
};

export type MultipleChoiceMenuParams = {
  id: number;
  value: string;
};

export type CreateCategory = {
  category: string;
  spend_target_value: number;
};

export type UpdateDeleteCategory = {
  id: number | null;
  category: string;
  spend_target_value: number;
  initial_flag: boolean;
};

export type GetUpdateProfile = {
  target_value_total_price: number;
  target_value_fixed_cost: number;
  target_value_deferred_pay: number;
};
