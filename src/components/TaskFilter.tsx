
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
    { key: 'all', label: 'All', emoji: '📋' },
    { key: 'incomplete', label: 'Pending', emoji: '⏳' },
    { key: 'complete', label: 'Complete', emoji: '✅' },
  ];

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Search Bar */}
      <div className="relative group">
        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
        <input
          type="text"
          placeholder="🔍 Search your tasks..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-3 py-2.5 sm:py-3 bg-white/80 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 shadow-sm hover:shadow-md transition-all duration-300 text-gray-700 placeholder-gray-500 text-sm"
        />
      </div>

      {/* Status Filter - Compact Pills */}
      <div className="bg-white/80 backdrop-blur-sm p-1.5 rounded-xl shadow-sm border border-white/30">
        <div className="flex space-x-1">
          {filters.map(({ key, label, emoji }) => (
            <button
              key={key}
              onClick={() => onFilterChange(key)}
              className={`flex-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${
                currentFilter === key
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
              }`}
            >
              <div className="flex flex-col items-center space-y-0.5">
                <span className="text-sm">{emoji}</span>
                <span className="font-medium">{label}</span>
                <span className="text-xs opacity-75">({taskCounts[key]})</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Sort Controls - Compact Row */}
      <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm p-2 rounded-xl shadow-sm border border-white/30">
        <div className="flex items-center space-x-2">
          <ArrowUpDown size={14} className="text-gray-500" />
          <span className="text-xs text-gray-600 font-medium">Sort:</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as SortBy)}
            className="px-2 py-1 bg-white/90 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/50 shadow-sm"
          >
            <option value="name">📝 Name</option>
            <option value="status">🎯 Status</option>
            <option value="createdAt">📅 Date</option>
          </select>
          
          <button
            onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-2 py-1 bg-white/90 border border-gray-200 rounded-lg text-xs hover:bg-gray-50 transition-all duration-200 shadow-sm min-w-[28px]"
          >
            {sortOrder === 'asc' ? '⬆️' : '⬇️'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskFilter;
