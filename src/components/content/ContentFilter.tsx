import React, { useState } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { Checkbox } from '../ui/Checkbox';
import { Calendar, Filter, SortAsc, Search, ChevronDown } from 'lucide-react';
import { Button } from '../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

interface ContentFilterProps {
  onFilter: (filters: any) => void;
}

export function ContentFilter({ onFilter }: ContentFilterProps) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Search and Toggle */}
          <div className="flex gap-2">
            <Input
              placeholder="Search content..."
              icon={<Search className="w-4 h-4" />}
              className="flex-1"
            />
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden"
              icon={<Filter className="w-4 h-4" />}
            >
              Filters
            </Button>
          </div>

          {/* Filters */}
          <AnimatePresence>
            {(showFilters || window.innerWidth >= 768) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-4 gap-4"
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Content Type</label>
                  <div className="space-y-1">
                    <Checkbox label="Images" checked />
                    <Checkbox label="Videos" checked />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Date Range</label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                      type="date"
                      className="flex-1"
                    />
                    <Input
                      type="date"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Status</label>
                  <div className="space-y-1">
                    <Checkbox label="Published" checked />
                    <Checkbox label="Scheduled" checked />
                    <Checkbox label="Draft" checked />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Sort By</label>
                  <select className="w-full bg-purple-900/20 border border-purple-800/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-creator-purple-500">
                    <option value="date_desc">Newest First</option>
                    <option value="date_asc">Oldest First</option>
                    <option value="engagement_desc">Highest Engagement</option>
                    <option value="engagement_asc">Lowest Engagement</option>
                  </select>
                </div>

                <div className="col-span-full flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {}}
                  >
                    Reset
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {}}
                    icon={<Filter className="w-4 h-4" />}
                  >
                    Apply Filters
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}