
import React from 'react';
import { Search, Filter, ArrowUpDown, Sparkles } from 'lucide-react';
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
  const filters: { key: TaskStatus; label: string; emoji: string; color: string }[] = [
    { key: 'all', label: 'All Tasks', emoji: '📋', color: 'from-gray-500 to-gray-600' },
    { key: 'incomplete', label: 'Pending', emoji: '⏳', color: 'from-orange-500 to-red-500' },
    { key: 'complete', label: 'Complete', emoji: '✅', color: 'from-green-500 to-emerald-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Enhanced Search Bar */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl blur opacity-20"></div>
        <div className="relative bg-white/80 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl overflow-hidden">
          <div className="relative">
            <Search size={24} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="🔍 Search your amazing tasks..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-transparent text-lg placeholder-gray-400 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Enhanced Status Filter */}
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-3">
            <Filter size={18} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-600">Filter by Status</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {filters.map(({ key, label, emoji, color }) => (
              <button
                key={key}
                onClick={() => onFilterChange(key)}
                className={`relative overflow-hidden rounded-xl p-4 text-center transition-all duration-300 transform hover:scale-105 ${
                  currentFilter === key
                    ? 'bg-gradient-to-r text-white shadow-lg scale-105'
                    : 'bg-white/60 text-gray-700 hover:bg-white/80 hover:shadow-md'
                }`}
                style={currentFilter === key ? { backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` } : {}}
              >
                {currentFilter === key && (
                  <div className={`absolute inset-0 bg-gradient-to-r ${color}`}></div>
                )}
                <div className="relative">
                  <div className="text-2xl mb-1">{emoji}</div>
                  <div className="font-semibold text-sm">{label}</div>
                  <div className={`text-xs mt-1 ${currentFilter === key ? 'text-white/90' : 'text-gray-500'}`}>
                    {taskCounts[key]} tasks
                  </div>
                </div>
                {currentFilter === key && (
                  <div className="absolute inset-0 bg-white/10 rounded-xl"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Enhanced Sort Controls */}
        <div className="lg:w-80">
          <div className="flex items-center space-x-2 mb-3">
            <ArrowUpDown size={18} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-600">Sort & Order</span>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
                <select
                  value={sortBy}
                  onChange={(e) => onSortByChange(e.target.value as SortBy)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
                  <option value="name">📝 Name</option>
                  <option value="status">📊 Status</option>
                  <option value="createdAt">📅 Date Created</option>
                </select>
              </div>
              
              <button
                onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
                className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                  sortOrder === 'asc'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                }`}
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  <span>{sortOrder === 'asc' ? 'Ascending' : 'Descending'}</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskFilter;
