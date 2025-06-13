
import React from 'react';
import { Check, Trash2 } from 'lucide-react';
import { Task } from '@/types/Task';

interface TaskCardProps {
  task: Task;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
}

const TaskCard = ({ task, onToggleStatus, onDelete }: TaskCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <button
            onClick={() => onToggleStatus(task.id)}
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
              task.status === 'complete'
                ? 'bg-green-500 border-green-500 text-white'
                : 'border-gray-300 hover:border-green-500'
            }`}
          >
            {task.status === 'complete' && <Check size={14} />}
          </button>
          
          <div className="flex-1">
            <h3
              className={`text-sm font-medium transition-all ${
                task.status === 'complete'
                  ? 'text-gray-500 line-through'
                  : 'text-gray-900'
              }`}
            >
              {task.name}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Created {task.createdAt.toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              task.status === 'complete'
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {task.status === 'complete' ? 'Complete' : 'Incomplete'}
          </span>
          
          <button
            onClick={() => onDelete(task.id)}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
