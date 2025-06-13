
import React from 'react';
import { Search } from 'lucide-react';
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
  const filters: { key: TaskStatus; label: string }[] = [
    { key: 'all', label: 'All Tasks' },
    { key: 'incomplete', label: 'Incomplete' },
    { key: 'complete', label: 'Complete' },
  ];

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        {/* Status Filter */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {filters.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => onFilterChange(key)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                currentFilter === key
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {label} ({taskCounts[key]})
            </button>
          ))}
        </div>

        {/* Sort Controls */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as SortBy)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="name">Name</option>
            <option value="status">Status</option>
            <option value="createdAt">Date Created</option>
          </select>
          
          <button
            onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskFilter;
