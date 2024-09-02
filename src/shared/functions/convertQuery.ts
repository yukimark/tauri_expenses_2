import { GetSpend, GetSpendQuery } from '../../types';

/**
 * 配列の中のboolean型の値をnumber型にして返します。
 * @param arr DB登録時に使うparams
 */
export function convertBooleanToNumber(arr: any[]): any[] {
  return arr.map((item) => {
    if (typeof item === 'boolean') {
      return item ? 1 : 0;
    }
    return item;
  });
}

/**
 * 取得したお小遣い帳の中でboolean型にしたいものを変換して返します。
 * @param spends お小遣い帳取得した配列
 */
export function convertSpendsIntegerToBoolean(spends: GetSpendQuery[]): GetSpend[] {
  return spends.map((spend) => ({
    ...spend,
    fixed_cost: spend.fixed_cost === 1 ? true : false,
    deferred_pay: spend.deferred_pay === 1 ? true : false,
  }));
}
