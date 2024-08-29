import { GetSpend, GetSpendQuery } from '../../types';

export function convertBooleanToNumber(arr: any[]): any[] {
  return arr.map((item) => {
    if (typeof item === 'boolean') {
      return item ? 1 : 0;
    }
    return item;
  });
}

export function convertSpendsIntegerToBoolean(spends: GetSpendQuery[]): GetSpend[] {
  return spends.map((spend) => ({
    ...spend,
    fixed_cost: spend.fixed_cost === 1 ? true : false,
    deferred_pay: spend.deferred_pay === 1 ? true : false,
  }));
}
