import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Switch } from '../components/ui/Switch';
import { Tabs } from '../components/ui/Tabs';
import { BillingOverview } from '../components/billing/BillingOverview';
import { PaymentMethods } from '../components/billing/PaymentMethods';
import { BillingHistory } from '../components/billing/BillingHistory';
import {
  User,
  Lock,
  Bell,
  Globe,
  CreditCard,
  Shield,
  Camera
} from 'lucide-react';

export function Settings() {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <Lock className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'preferences', label: 'Preferences', icon: <Globe className="w-4 h-4" /> },
    { id: 'billing', label: 'Billing', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'privacy', label: 'Privacy', icon: <Shield className="w-4 h-4" /> }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-400">Manage your account settings and preferences.</p>
      </div>

      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="underline"
      />

      {activeTab === 'profile' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Profile Settings</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <img
                      src="https://source.unsplash.com/random/100x100?portrait"
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                    <button className="absolute bottom-0 right-0 p-2 bg-purple-900/90 rounded-full border border-purple-800/50">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <h3 className="font-semibold">Profile Photo</h3>
                    <p className="text-sm text-gray-400">
                      Upload a photo to personalize your profile
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Display Name"
                    placeholder="Enter your display name"
                  />
                  <Input
                    label="Username"
                    placeholder="Enter your username"
                  />
                  <Input
                    label="Email"
                    type="email"
                    placeholder="Enter your email"
                  />
                  <Input
                    label="Phone"
                    type="tel"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Bio
                  </label>
                  <textarea
                    className="w-full bg-purple-900/20 border border-purple-800/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows={4}
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div className="flex justify-end">
                  <Button variant="primary">Save Changes</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'billing' && (
        <div className="space-y-6">
          <BillingOverview />
          <PaymentMethods />
          <BillingHistory />
        </div>
      )}

      {activeTab === 'notifications' && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Notification Preferences</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                'Email notifications for new subscribers',
                'Push notifications for messages',
                'Weekly analytics report',
                'Content moderation alerts',
                'Billing notifications'
              ].map((setting, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span>{setting}</span>
                  <Switch checked={true} onChange={() => {}} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add other tab content as needed */}
    </div>
  );
}