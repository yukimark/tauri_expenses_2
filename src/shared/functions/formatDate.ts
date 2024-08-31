/**
 * string型の年月日を返します。
 * @param date 年月日と時刻
 */
export function formatDateToYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/**
 * string型の年月を返します。
 * @param date 年月日と時刻
 */
export function formatDateToYYYYMM(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');

  return `${year}-${month}`;
}

/**
 * string型の年月(1ヶ月前)を返します。
 * @param date 年月日と時刻
 */
export function formatDateToYYYYMMLastMonth(date: Date): string {
  let year = date.getFullYear();
  let month = date.getMonth();

  if (month === 0) {
    month = 12;
    year -= 1;
  }

  const formattedMonth = month.toString().padStart(2, '0');

  return `${year}-${formattedMonth}`;
}
