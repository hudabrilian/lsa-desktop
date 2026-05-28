export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(value)
}

export function formatNumber(value: number, fractionDigits: number = 0): string {
  return new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: fractionDigits
  }).format(value)
}
