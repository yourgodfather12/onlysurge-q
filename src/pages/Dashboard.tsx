import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { DashboardOverview } from '../components/dashboard/DashboardOverview';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Tabs } from '../components/ui/Tabs';
import { Select } from '../components/ui/Select';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Users,
  DollarSign,
  Heart,
  Calendar,
  ArrowRight,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';

// Mock data for demonstration
const mockStats = {
  earnings: 24500,
  subscribers: 2451,
  engagement: 8.2,
  posts: 152
};

export function Dashboard() {
  const { profile } = useAuth();
  const [dateRange, setDateRange] = useState('30d');
  const [activeTab, setActiveTab] = useState('overview');

  if (!profile) return null;

  return (
    <div className="space-y-6">
      <DashboardOverview profile={profile} stats={mockStats} />

      {/* Additional dashboard content can be added here */}
    </div>
  );
}