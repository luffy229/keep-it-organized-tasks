
import React from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { TaskStatus, SortBy, SortOrder } from '@/types/Task';

interface TaskFilterProps {
  currentFilter: TaskStatus;
  onFilterChange: (filter: TaskStatus) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  sortBy: SortBy;
  onSortByChange: (sortBy: SortBy) => void;
  sortOrder: SortOrder;
  onSortOrderChange: (order: SortOrder) => void;
  taskCounts: {
    all: number;
    complete: number;
    incomplete: number;
  };
}

const TaskFilter = ({ 
  currentFilter, 
  onFilterChange, 
  searchTerm, 
  onSearchChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  taskCounts 
}: TaskFilterProps) => {
  const filters: { key: TaskStatus; label: string; emoji: string }[] = [
    { key: 'all', label: 'All Tasks', emoji: '📋' },
    { key: 'incomplete', label: 'Pending', emoji: '⏳' },
    { key: 'complete', label: 'Complete', emoji: '✅' },
  ];

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Search Bar - enhanced mobile styling */}
      <div className="relative group">
        <Search size={18} className="lg:w-5 lg:h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
        <input
          type="text"
          placeholder="🔍 Search your tasks..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-4 py-4 lg:py-4 bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl lg:rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 shadow-lg hover:shadow-xl transition-all duration-300 text-gray-700 placeholder-gray-500 text-base lg:text-base"
        />
      </div>

      <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:gap-4 lg:items-center lg:justify-between">
        {/* Status Filter - improved mobile layout */}
        <div className="space-y-3 lg:space-y-0">
          <div className="flex items-center space-x-2 lg:hidden">
            <Filter size={16} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-600">Filter:</span>
          </div>
          <div className="grid grid-cols-1 gap-2 lg:flex lg:items-center lg:space-x-2 lg:bg-white/70 lg:backdrop-blur-sm lg:p-2 lg:rounded-2xl lg:shadow-lg lg:border lg:border-white/20">
            <div className="hidden lg:flex lg:items-center lg:space-x-2">
              <Filter size={16} className="text-gray-500" />
            </div>
            {filters.map(({ key, label, emoji }) => (
              <button
                key={key}
                onClick={() => onFilterChange(key)}
                className={`w-full lg:w-auto px-4 py-3 lg:px-4 lg:py-2 rounded-xl lg:rounded-xl text-sm lg:text-sm font-medium transition-all duration-300 ${
                  currentFilter === key
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105'
                    : 'text-gray-600 hover:text-gray-900 bg-white/60 hover:bg-white/80 hover:shadow-sm border border-white/30'
                }`}
              >
                <span className="mr-2">{emoji}</span>
                {label} ({taskCounts[key]})
              </button>
            ))}
          </div>
        </div>

        {/* Sort Controls - improved mobile layout */}
        <div className="space-y-3 lg:space-y-0">
          <div className="flex items-center space-x-2 lg:hidden">
            <ArrowUpDown size={16} className="text-gray-500" />
            <span className="text-sm text-gray-600 font-medium">Sort:</span>
          </div>
          <div className="flex flex-col space-y-2 lg:flex-row lg:items-center lg:space-y-0 lg:space-x-3 lg:bg-white/70 lg:backdrop-blur-sm lg:p-2 lg:rounded-2xl lg:shadow-lg lg:border lg:border-white/20">
            <div className="hidden lg:flex lg:items-center lg:space-x-3">
              <ArrowUpDown size={16} className="text-gray-500" />
              <span className="text-sm text-gray-600 font-medium">Sort:</span>
            </div>
            <div className="flex space-x-3">
              <select
                value={sortBy}
                onChange={(e) => onSortByChange(e.target.value as SortBy)}
                className="flex-1 px-4 py-3 lg:px-3 lg:py-2 bg-white/80 border border-gray-200 rounded-xl lg:rounded-xl text-sm lg:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm"
              >
                <option value="name">📝 Name</option>
                <option value="status">🎯 Status</option>
                <option value="createdAt">📅 Date</option>
              </select>
              
              <button
                onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-4 py-3 lg:px-3 lg:py-2 bg-white/80 border border-gray-200 rounded-xl lg:rounded-xl text-sm lg:text-sm hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                {sortOrder === 'asc' ? '⬆️' : '⬇️'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskFilter;
