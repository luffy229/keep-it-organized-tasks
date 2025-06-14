
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
    <div className="space-y-4 sm:space-y-6">
      {/* Search Bar - responsive */}
      <div className="relative group">
        <Search size={18} className="sm:w-5 sm:h-5 absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
        <input
          type="text"
          placeholder="🔍 Search your tasks..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 shadow-lg hover:shadow-xl transition-all duration-300 text-gray-700 placeholder-gray-500 text-sm sm:text-base"
        />
      </div>

      <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 gap-4 lg:items-center lg:justify-between">
        {/* Status Filter - responsive layout */}
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <div className="flex items-center space-x-2 sm:space-x-2">
            <Filter size={16} className="sm:w-4 sm:h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-600 sm:hidden">Filter:</span>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 bg-white/70 backdrop-blur-sm p-2 rounded-xl sm:rounded-2xl shadow-lg border border-white/20">
            {filters.map(({ key, label, emoji }) => (
              <button
                key={key}
                onClick={() => onFilterChange(key)}
                className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 ${
                  currentFilter === key
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/60 hover:shadow-sm'
                }`}
              >
                <span className="mr-1 sm:mr-2">{emoji}</span>
                <span className="hidden sm:inline">{label} ({taskCounts[key]})</span>
                <span className="sm:hidden">({taskCounts[key]})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sort Controls - responsive layout */}
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 bg-white/70 backdrop-blur-sm p-2 rounded-xl sm:rounded-2xl shadow-lg border border-white/20">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <ArrowUpDown size={16} className="sm:w-4 sm:h-4 text-gray-500" />
            <span className="text-xs sm:text-sm text-gray-600 font-medium">Sort:</span>
          </div>
          <div className="flex space-x-2 sm:space-x-3">
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value as SortBy)}
              className="flex-1 sm:flex-none px-2 py-1.5 sm:px-3 sm:py-2 bg-white/80 border border-gray-200 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm"
            >
              <option value="name">📝 Name</option>
              <option value="status">🎯 Status</option>
              <option value="createdAt">📅 Date</option>
            </select>
            
            <button
              onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-2 py-1.5 sm:px-3 sm:py-2 bg-white/80 border border-gray-200 rounded-lg sm:rounded-xl text-xs sm:text-sm hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              {sortOrder === 'asc' ? '⬆️' : '⬇️'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskFilter;
