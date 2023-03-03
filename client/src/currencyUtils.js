export function ethBalanceToFiat(balance, exchangeRate) {
  if (!balance) return 0;
  return Number(balance) * exchangeRate;
}

export function getRateFromCurrency(exchangeRate, currency) {
  if (!currency || !exchangeRate) return exchangeRate?.ethusd || 0;
  if (currency === 'USD') return exchangeRate.ethusd;
  else return exchangeRate.ethusd * 0.92;
}

export function formatCurrency(amount, currency){
  const currencyFromat = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
  });
  return currencyFromat.format(amount);
}