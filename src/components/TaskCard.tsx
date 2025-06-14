
import React from 'react';
import { Check, Trash2, Edit } from 'lucide-react';
import { Task } from '@/types/Task';

interface TaskCardProps {
  task: Task;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

const TaskCard = ({ task, onToggleStatus, onDelete, onEdit }: TaskCardProps) => {
  const isComplete = task.status === 'complete';
  
  return (
    <div className={`group bg-white rounded-lg shadow-sm p-3 sm:p-4 transition-all duration-500 ${
      isComplete 
        ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200' 
        : 'hover:shadow-md border border-gray-100'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
          <button
            onClick={() => onToggleStatus(task.id)}
            className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
              isComplete
                ? 'bg-green-500 border-green-500'
                : 'border-gray-300 hover:border-green-400'
            }`}
            aria-label={isComplete ? "Mark as incomplete" : "Mark as complete"}
          >
            {isComplete && (
              <Check size={10} className="sm:w-3 sm:h-3 text-white" />
            )}
          </button>
          
          <div className="flex-1 min-w-0">
            <h3 className={`text-sm sm:text-base font-medium transition-all duration-300 truncate ${
              isComplete 
                ? 'line-through text-gray-500' 
                : 'text-gray-800'
            }`}>
              {task.name}
            </h3>
            <p className="text-xs text-blue-500 mt-0.5">
              {task.createdAt.toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-1 flex-shrink-0">
          {isComplete ? (
            <div className="px-2 py-1 rounded-full text-green-700 bg-green-100 text-xs font-medium">
              <span className="hidden sm:inline">Complete</span>
              <span className="sm:hidden">✅</span>
            </div>
          ) : (
            <div className="px-2 py-1 rounded-full text-amber-700 bg-amber-100 text-xs font-medium">
              <span className="hidden sm:inline">Pending</span>
              <span className="sm:hidden">⏳</span>
            </div>
          )}
          
          <div className="flex opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={() => onEdit(task)}
              className="p-1 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-all duration-200"
              aria-label="Edit task"
            >
              <Edit size={14} />
            </button>
            
            <button
              onClick={() => onDelete(task.id)}
              className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-all duration-200"
              aria-label="Delete task"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
