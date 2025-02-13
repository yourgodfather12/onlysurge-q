import React from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import {
  Download,
  Receipt,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useBillingHistory } from '../../hooks/useBillingHistory';
import { formatCurrency } from '../../lib/utils';

export function BillingHistory() {
  const { invoices, loading, error } = useBillingHistory();

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-creator-purple-500 border-t-transparent rounded-full mx-auto" />
          <p className="mt-4 text-gray-400">Loading billing history...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center gap-3 text-red-400">
            <AlertCircle className="w-5 h-5" />
            <p>Failed to load billing history</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Billing History</h2>
          <Button
            variant="outline"
            icon={<Download className="w-4 h-4" />}
          >
            Download All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-purple-800/30">
                <th className="text-left py-3 px-4">Date</th>
                <th className="text-left py-3 px-4">Description</th>
                <th className="text-left py-3 px-4">Amount</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Invoice</th>
              </tr>
            </thead>
            <tbody>
              {invoices?.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="border-b border-purple-800/30 hover:bg-purple-900/20"
                >
                  <td className="py-3 px-4">
                    {new Date(invoice.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Receipt className="w-4 h-4 text-purple-400" />
                      <span>Invoice #{invoice.number}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {formatCurrency(invoice.amount)}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                      invoice.status === 'paid'
                        ? 'bg-green-500/20 text-green-400'
                        : invoice.status === 'pending'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {invoice.status === 'paid' ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <Clock className="w-3 h-3" />
                      )}
                      {invoice.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Download className="w-4 h-4" />}
                      onClick={() => window.open(invoice.pdf_url)}
                    >
                      Download
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {invoices?.length === 0 && (
            <div className="text-center py-8">
              <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No billing history</h3>
              <p className="text-gray-400">
                Your billing history will appear here once you have active subscriptions
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}