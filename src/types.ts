export type Category = {
  id: number;
  category: string;
}

export type Categories<T> = T[];

export type Spend = {
  date: string;
  category_id: number | null;
  price: number | null;
  fixed_cost: boolean;
  deferred_pay: boolean;
  memo: string;
}
