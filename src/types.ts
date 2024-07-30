export type Category = {
  id: number;
  category: string;
}

export type Categories<T> = T[];

export type Spend = {
  date: Date;
  category_id: number;
  price: number;
  fixed_cost: boolean;
  deferred_pay: boolean;
  memo: string;
}
