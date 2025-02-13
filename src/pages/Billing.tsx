import React from 'react';
import { BillingOverview } from '../components/billing/BillingOverview';
import { PaymentMethods } from '../components/billing/PaymentMethods';
import { BillingHistory } from '../components/billing/BillingHistory';
import { UsageOverview } from '../components/billing/UsageOverview';
import { SubscriptionAnalytics } from '../components/billing/SubscriptionAnalytics';
import { BillingPortal } from '../components/billing/BillingPortal';

export function Billing() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Billing & Subscription</h1>
        <p className="text-gray-400">Manage your subscription, payment methods, and billing history.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BillingOverview />
        <UsageOverview />
      </div>

      <PaymentMethods />
      <BillingHistory />
      <SubscriptionAnalytics />
      <BillingPortal />
    </div>
  );
}