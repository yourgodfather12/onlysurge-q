import React from 'react';
import { TrendingUp, Users, Activity, Heart } from 'lucide-react';
import { Card } from './ui/Card';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change: string;
  positive?: boolean;
}

function StatCard({ title, value, icon, change, positive = true }: StatCardProps) {
  return (
    <Card hover>
      <div className="p-4 sm:p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-gray-400 text-sm">{title}</p>
            <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">{value}</h3>
          </div>
          <div className="p-2 bg-purple-800/30 rounded-lg">
            {icon}
          </div>
        </div>
        <div className={`mt-4 flex items-center text-sm ${positive ? 'text-green-400' : 'text-red-400'}`}>
          <span>{change}</span>
          <div className={`ml-2 ${positive ? 'rotate-0' : 'rotate-180'}`}>↑</div>
        </div>
      </div>
    </Card>
  );
}

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <StatCard
        title="Total Followers"
        value="24.5K"
        icon={<Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />}
        change="+12.5% this week"
      />
      <StatCard
        title="Engagement Rate"
        value="8.2%"
        icon={<Activity className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />}
        change="+3.2% this week"
      />
      <StatCard
        title="Growth Rate"
        value="+2.1K"
        icon={<TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />}
        change="-0.5% this week"
        positive={false}
      />
      <StatCard
        title="Likes"
        value="152K"
        icon={<Heart className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />}
        change="+8.1% this week"
      />
    </div>
  );
}