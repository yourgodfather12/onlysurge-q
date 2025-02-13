import useSWR from 'swr';
import { getPaymentMethods } from '../lib/stripe';

export function usePaymentMethods() {
  const { data, error, mutate } = useSWR(
    'payment-methods',
    () => getPaymentMethods(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  );

  return {
    paymentMethods: data,
    loading: !error && !data,
    error,
    mutate
  };
}