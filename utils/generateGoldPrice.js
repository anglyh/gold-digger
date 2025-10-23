const MAX_PRICE = 2200;
const MIN_PRICE = 2000;

export function generateGoldPrice() {
  return (Math.random() * (MAX_PRICE - MIN_PRICE) + MIN_PRICE).toFixed(2)
}
