import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  Plus,
  Trash2,
  Star,
  AlertCircle,
  X
} from 'lucide-react';
import { usePaymentMethods } from '../../hooks/usePaymentMethods';
import { setDefaultPaymentMethod, removePaymentMethod } from '../../lib/stripe';

export function PaymentMethods() {
  const { paymentMethods, loading, error, mutate } = usePaymentMethods();
  const [showAddCard, setShowAddCard] = useState(false);

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultPaymentMethod(id);
      mutate();
    } catch (error) {
      console.error('Failed to set default payment method:', error);
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await removePaymentMethod(id);
      mutate();
    } catch (error) {
      console.error('Failed to remove payment method:', error);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-creator-purple-500 border-t-transparent rounded-full mx-auto" />
          <p className="mt-4 text-gray-400">Loading payment methods...</p>
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
            <p>Failed to load payment methods</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Payment Methods</h2>
          <Button
            variant="outline"
            onClick={() => setShowAddCard(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            Add Payment Method
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {paymentMethods?.map((method) => (
            <div
              key={method.id}
              className="flex items-center justify-between p-4 rounded-lg bg-purple-900/20"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-900/40 rounded-lg">
                  <CreditCard className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">
                      {method.brand} •••• {method.last_four}
                    </p>
                    {method.is_default && (
                      <span className="px-2 py-1 rounded-full text-xs bg-purple-900/40 text-purple-400">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400">
                    Expires {method.expiry_month}/{method.expiry_year}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!method.is_default && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSetDefault(method.id)}
                    icon={<Star className="w-4 h-4" />}
                  >
                    Make Default
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemove(method.id)}
                  icon={<Trash2 className="w-4 h-4" />}
                  className="text-red-400 hover:text-red-300"
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}

          {paymentMethods?.length === 0 && (
            <div className="text-center py-8">
              <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No payment methods</h3>
              <p className="text-gray-400 mb-4">
                Add a payment method to manage your subscription
              </p>
              <Button
                variant="outline"
                onClick={() => setShowAddCard(true)}
                icon={<Plus className="w-4 h-4" />}
              >
                Add Payment Method
              </Button>
            </div>
          )}
        </div>
      </CardContent>

      {/* Add Card Modal */}
      <AnimatePresence>
        {showAddCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="w-full max-w-lg"
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">Add Payment Method</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAddCard(false)}
                      icon={<X className="w-4 h-4" />}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Stripe Elements will be mounted here */}
                  <div id="card-element" className="p-4 rounded-lg bg-purple-900/20" />
                  <Button
                    variant="primary"
                    className="w-full mt-4"
                    icon={<Plus className="w-4 h-4" />}
                  >
                    Add Card
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}