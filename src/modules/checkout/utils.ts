// Stripe API, of course, expects amounts in the form of integers
export function usdToInteger(value: number): number {
  return Math.round(value * 100);
}
