
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
  return (
    <div className="group bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 hover:bg-white/80">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <button
            onClick={() => onToggleStatus(task.id)}
            className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
              task.status === 'complete'
                ? 'bg-gradient-to-r from-green-400 to-emerald-500 border-green-400 text-white shadow-lg shadow-green-200'
                : 'border-gray-300 hover:border-blue-400 hover:shadow-md hover:scale-110 bg-white'
            }`}
          >
            {task.status === 'complete' && <Check size={16} className="animate-scale-in" />}
          </button>
          
          <div className="flex-1">
            <h3
              className={`text-lg font-semibold transition-all duration-300 ${
                task.status === 'complete'
                  ? 'text-gray-500 line-through'
                  : 'text-gray-800 group-hover:text-gray-900'
              }`}
            >
              {task.name}
            </h3>
            <p className="text-sm text-gray-500 mt-1 flex items-center">
              <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
              Created {task.createdAt.toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <span
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              task.status === 'complete'
                ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200'
                : 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border border-amber-200'
            }`}
          >
            {task.status === 'complete' ? '✨ Complete' : '⏳ Pending'}
          </span>
          
          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={() => onEdit(task)}
              className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-110"
            >
              <Edit size={18} />
            </button>
            
            <button
              onClick={() => onDelete(task.id)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110"
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
