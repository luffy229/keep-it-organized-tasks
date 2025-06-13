
import React from 'react';
import { TaskStatus } from '@/types/Task';

interface TaskFilterProps {
  currentFilter: TaskStatus;
  onFilterChange: (filter: TaskStatus) => void;
  taskCounts: {
    all: number;
    complete: number;
    incomplete: number;
  };
}

const TaskFilter = ({ currentFilter, onFilterChange, taskCounts }: TaskFilterProps) => {
  const filters: { key: TaskStatus; label: string }[] = [
    { key: 'all', label: 'All Tasks' },
    { key: 'incomplete', label: 'Incomplete' },
    { key: 'complete', label: 'Complete' },
  ];

  return (
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
  );
};

export default TaskFilter;
