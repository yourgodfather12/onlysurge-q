import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import {
  Users,
  Search,
  Filter,
  SortAsc,
  Mail,
  Star,
  MoreVertical,
  Download
} from 'lucide-react';

export function Subscribers() {
  const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([]);

  // Mock data for demonstration
  const subscribers = Array.from({ length: 10 }, (_, i) => ({
    id: `sub-${i}`,
    name: `Subscriber ${i + 1}`,
    email: `subscriber${i + 1}@example.com`,
    subscribed: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
    status: Math.random() > 0.3 ? 'active' : 'expired',
    spent: Math.floor(Math.random() * 1000),
    avatar: `https://source.unsplash.com/random/100x100?portrait=${i}`
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Subscribers</h1>
          <p className="text-gray-400">Manage and analyze your subscriber base.</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            icon={<Download className="w-4 h-4" />}
          >
            Export
          </Button>
          <Button
            variant="primary"
            icon={<Mail className="w-4 h-4" />}
          >
            Message All
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search subscribers..."
              icon={<Search className="w-4 h-4" />}
              className="flex-1"
            />
            <div className="flex gap-2">
              <select className="bg-purple-900/20 border border-purple-800/50 rounded-lg px-3 py-2 text-white">
                <option>All Status</option>
                <option>Active</option>
                <option>Expired</option>
              </select>
              <Button
                variant="outline"
                icon={<Filter className="w-4 h-4" />}
              >
                Filters
              </Button>
              <Button
                variant="outline"
                icon={<SortAsc className="w-4 h-4" />}
              >
                Sort
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-purple-800/30">
                  <th className="text-left py-3 px-4">
                    <input
                      type="checkbox"
                      className="rounded border-purple-800/50"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedSubscribers(subscribers.map(s => s.id));
                        } else {
                          setSelectedSubscribers([]);
                        }
                      }}
                    />
                  </th>
                  <th className="text-left py-3 px-4">Subscriber</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Subscribed</th>
                  <th className="text-left py-3 px-4">Total Spent</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((subscriber) => (
                  <tr
                    key={subscriber.id}
                    className="border-b border-purple-800/30 hover:bg-purple-900/20"
                  >
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        className="rounded border-purple-800/50"
                        checked={selectedSubscribers.includes(subscriber.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSubscribers([...selectedSubscribers, subscriber.id]);
                          } else {
                            setSelectedSubscribers(selectedSubscribers.filter(id => id !== subscriber.id));
                          }
                        }}
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={subscriber.avatar}
                          alt={subscriber.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium">{subscriber.name}</p>
                          <p className="text-sm text-gray-400">{subscriber.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        subscriber.status === 'active'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {subscriber.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-400">
                      {subscriber.subscribed.toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      ${subscriber.spent.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<Mail className="w-4 h-4" />}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<Star className="w-4 h-4" />}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<MoreVertical className="w-4 h-4" />}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Subscriber Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Total Subscribers</p>
                <h3 className="text-2xl font-bold mt-1">2,451</h3>
              </div>
              <div className="p-2 bg-purple-900/20 rounded-lg">
                <Users className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-400">
              <span>+12.5% this month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Active Subscribers</p>
                <h3 className="text-2xl font-bold mt-1">1,890</h3>
              </div>
              <div className="p-2 bg-purple-900/20 rounded-lg">
                <Users className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-400">
              <span>+8.2% this month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Avg. Subscription Length</p>
                <h3 className="text-2xl font-bold mt-1">4.2 months</h3>
              </div>
              <div className="p-2 bg-purple-900/20 rounded-lg">
                <Users className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-400">
              <span>+3.1% this month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Churn Rate</p>
                <h3 className="text-2xl font-bold mt-1">2.8%</h3>
              </div>
              <div className="p-2 bg-purple-900/20 rounded-lg">
                <Users className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-red-400">
              <span>+0.5% this month</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}