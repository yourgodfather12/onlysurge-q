import React from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { ExternalLink } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

export function BillingPortal() {
  const handleOpenPortal = async () => {
    try {
      const { data: { url }, error } = await supabase
        .functions.invoke('create-portal-session');

      if (error) throw error;
      window.location.href = url;
    } catch (error) {
      console.error('Failed to open billing portal:', error);
      toast.error('Failed to open billing portal');
    }
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">Billing Portal</h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-gray-400">
            Manage your subscription, payment methods, and billing history in the Stripe billing portal.
          </p>
          <Button
            variant="outline"
            onClick={handleOpenPortal}
            icon={<ExternalLink className="w-4 h-4" />}
          >
            Open Billing Portal
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}