export const NumToStringWithComma = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export function convertValueByFactor(value: string, factor: number): string {
  return value ? String(Number(value) * factor) : '';
}
