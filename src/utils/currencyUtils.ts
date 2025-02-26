export const convertCurrency = (
  amount: number,
  targetCurrency: string,
  rates: { [key: string]: number },
  baseCurrency: string
): number => {
  if (baseCurrency === "EUR") {
    const usdRate = rates["USD"];
    if (!usdRate) return amount;
    const amountInEUR = amount / usdRate;
    if (targetCurrency === "EUR") return amountInEUR;
    const targetRate = rates[targetCurrency];
    if (!targetRate) return amountInEUR;
    return amountInEUR * targetRate;
  }
  if (targetCurrency === baseCurrency) return amount;
  const targetRate = rates[targetCurrency];
  if (!targetRate) return amount;
  return amount * targetRate;
};

export const formatCurrency = (
    amount: number,
    targetCurrency: string = "USD",
    rates?: { [key: string]: number },
    baseCurrency: string = "USD",
    locale: string = "en-US"
  ): string => {
    const convertedAmount = rates
      ? convertCurrency(amount, targetCurrency, rates, baseCurrency)
      : amount;
  
    const currencyDisplay =
      targetCurrency === "KZT" || targetCurrency === "RUB"
        ? "narrowSymbol"
        : "symbol";
  
    const formatter = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: targetCurrency,
      currencyDisplay,
    });
    return formatter.format(convertedAmount);
  };
  