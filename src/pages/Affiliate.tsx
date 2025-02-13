import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  DollarSign,
  Link2,
  Copy,
  Share2,
  TrendingUp,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export function Affiliate() {
  const [showCopied, setShowCopied] = useState(false);
  const affiliateLink = 'https://onlysurge.com/ref/creator123';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(affiliateLink);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Affiliate Program</h1>
        <p className="text-gray-400">Earn by referring other creators to OnlySurge.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Total Earnings</p>
                <h3 className="text-2xl font-bold mt-1">$2,450</h3>
              </div>
              <div className="p-2 bg-purple-900/20 rounded-lg">
                <DollarSign className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-400">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>+12.5% this month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Active Referrals</p>
                <h3 className="text-2xl font-bold mt-1">24</h3>
              </div>
              <div className="p-2 bg-purple-900/20 rounded-lg">
                <Users className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-400">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>+8.2% this month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Conversion Rate</p>
                <h3 className="text-2xl font-bold mt-1">32.5%</h3>
              </div>
              <div className="p-2 bg-purple-900/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-400">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>+3.1% this month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Pending Payout</p>
                <h3 className="text-2xl font-bold mt-1">$580</h3>
              </div>
              <div className="p-2 bg-purple-900/20 rounded-lg">
                <DollarSign className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-400">
                <Clock className="w-4 h-4 mr-1" />
                <span>Next payout in 5 days</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Affiliate Link */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Your Affiliate Link</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Input
                value={affiliateLink}
                readOnly
                className="flex-1"
                icon={<Link2 className="w-4 h-4" />}
              />
              <Button
                variant="outline"
                onClick={copyToClipboard}
                icon={<Copy className="w-4 h-4" />}
              >
                Copy
              </Button>
              <Button
                variant="outline"
                icon={<Share2 className="w-4 h-4" />}
              >
                Share
              </Button>
            </div>
            <AnimatePresence>
              {showCopied && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 text-green-400"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Copied to clipboard!</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {/* Recent Referrals */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Recent Referrals</h2>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-purple-800/30">
                  <th className="text-left py-3 px-4">Creator</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Joined</th>
                  <th className="text-left py-3 px-4">Earnings</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 5 }, (_, i) => (
                  <tr
                    key={i}
                    className="border-b border-purple-800/30 hover:bg-purple-900/20"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={`https://source.unsplash.com/random/100x100?portrait=${i}`}
                          alt="Creator"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium">Creator {i + 1}</p>
                          <p className="text-sm text-gray-400">@creator{i + 1}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        Math.random() > 0.3
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {Math.random() > 0.3 ? 'Active' : 'Pending'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-400">
                      {new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      ${(Math.random() * 500).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Marketing Materials */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Marketing Materials</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: 'Banner Pack', size: '12 files', type: 'ZIP' },
              { title: 'Social Media Kit', size: '8 files', type: 'ZIP' },
              { title: 'Email Templates', size: '5 files', type: 'PDF' }
            ].map((material, i) => (
              <div
                key={i}
                className="p-4 rounded-lg bg-purple-900/20 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">{material.title}</p>
                  <p className="text-sm text-gray-400">
                    {material.size} • {material.type}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Download className="w-4 h-4" />}
                >
                  Download
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}