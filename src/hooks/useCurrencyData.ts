import { useAppSelector } from "../redux";

export const useCurrencyData = () => {
  const currency = useAppSelector((state) => state.currency.currency);
  const rates = useAppSelector((state) => state.exchangeRates.rates);
  const baseCurrency = useAppSelector((state) => state.exchangeRates.base);
  return { currency, rates, baseCurrency };
};
