
import React from 'react';
import { Check, Trash2, Edit, Clock, Sparkles } from 'lucide-react';
import { Task } from '@/types/Task';

interface TaskCardProps {
  task: Task;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

const TaskCard = ({ task, onToggleStatus, onDelete, onEdit }: TaskCardProps) => {
  return (
    <div className={`group relative bg-gradient-to-r ${
      task.status === 'complete' 
        ? 'from-green-50 to-emerald-50 border-green-200' 
        : 'from-blue-50 to-indigo-50 border-blue-200'
    } rounded-xl shadow-sm border hover:shadow-lg transition-all duration-300 p-5 transform hover:-translate-y-1`}>
      
      {/* Decorative elements */}
      <div className="absolute top-3 right-3 opacity-20">
        {task.status === 'complete' ? (
          <Sparkles size={20} className="text-green-500" />
        ) : (
          <Clock size={20} className="text-blue-500" />
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <button
            onClick={() => onToggleStatus(task.id)}
            className={`relative w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${
              task.status === 'complete'
                ? 'bg-gradient-to-r from-green-400 to-emerald-500 border-green-400 text-white shadow-lg'
                : 'border-gray-300 hover:border-blue-400 bg-white hover:bg-blue-50'
            }`}
          >
            {task.status === 'complete' && (
              <Check size={16} className="animate-bounce" />
            )}
            {task.status === 'complete' && (
              <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75"></div>
            )}
          </button>
          
          <div className="flex-1">
            <h3
              className={`text-lg font-semibold transition-all duration-300 ${
                task.status === 'complete'
                  ? 'text-gray-500 line-through'
                  : 'text-gray-800 group-hover:text-blue-700'
              }`}
            >
              {task.name}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <Clock size={14} className="text-gray-400" />
              <p className="text-sm text-gray-500">
                Created {task.createdAt.toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <span
            className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide transition-all duration-300 ${
              task.status === 'complete'
                ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200'
                : 'bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700 border border-yellow-200'
            }`}
          >
            {task.status === 'complete' ? '✓ Complete' : '⏳ Pending'}
          </span>
          
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={() => onEdit(task)}
              className="p-2 text-gray-400 hover:text-blue-600 transition-all duration-200 hover:bg-blue-100 rounded-lg transform hover:scale-110"
            >
              <Edit size={18} />
            </button>
            
            <button
              onClick={() => onDelete(task.id)}
              className="p-2 text-gray-400 hover:text-red-600 transition-all duration-200 hover:bg-red-100 rounded-lg transform hover:scale-110"
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
