
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
    <div className={`group bg-white rounded-xl shadow-md p-6 transition-all duration-500 ${
      isComplete 
        ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 shadow-green-100' 
        : 'hover:shadow-lg'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <button
            onClick={() => onToggleStatus(task.id)}
            className={`w-6 h-6 mt-1 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
              isComplete
                ? 'bg-green-500 border-green-500 shadow-lg shadow-green-200 scale-110'
                : 'border-gray-300 hover:border-green-400'
            }`}
            aria-label={isComplete ? "Mark as incomplete" : "Mark as complete"}
          >
            {isComplete && (
              <Check size={14} className="text-white animate-scale-in" />
            )}
          </button>
          
          <div className="flex-1">
            <h3 className={`text-lg font-medium transition-all duration-300 ${
              isComplete 
                ? 'line-through text-gray-500 opacity-75' 
                : 'text-gray-800'
            }`}>
              {task.name}
            </h3>
            <p className="text-sm text-blue-500 mt-1 flex items-center">
              <span>Created {task.createdAt.toLocaleDateString()}</span>
            </p>
          </div>
        </div>
        
        <div className="flex items-center">
          {isComplete ? (
            <div className="px-4 py-2 rounded-full text-green-700 bg-green-100 text-sm font-medium ml-2 animate-scale-in">
              <div className="flex items-center">
                <span className="mr-1">✅</span>
                Complete
              </div>
            </div>
          ) : (
            <div className="px-4 py-2 rounded-full text-amber-700 bg-amber-100 text-sm font-medium ml-2">
              <div className="flex items-center">
                <span className="mr-1">⏳</span>
                Pending
              </div>
            </div>
          )}
          
          <div className="flex space-x-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={() => onEdit(task)}
              className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all duration-200"
              aria-label="Edit task"
            >
              <Edit size={18} />
            </button>
            
            <button
              onClick={() => onDelete(task.id)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
              aria-label="Delete task"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
