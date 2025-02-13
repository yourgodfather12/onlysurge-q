import useSWR from 'swr';
import { getInvoices } from '../lib/stripe';

export function useBillingHistory() {
  const { data, error } = useSWR(
    'invoices',
    () => getInvoices(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  );

  return {
    invoices: data,
    loading: !error && !data,
    error
  };
}