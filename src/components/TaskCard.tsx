
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
    <div className="group bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-3 xs:p-4 sm:p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 hover:bg-white/80">
      <div className="flex items-center justify-between gap-2 xs:gap-3">
        <div className="flex items-center space-x-2 xs:space-x-3 sm:space-x-4 flex-1 min-w-0">
          <button
            onClick={() => onToggleStatus(task.id)}
            className={`w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
              task.status === 'complete'
                ? 'bg-gradient-to-r from-green-400 to-emerald-500 border-green-400 text-white shadow-lg shadow-green-200'
                : 'border-gray-300 hover:border-blue-400 hover:shadow-md hover:scale-110 bg-white'
            }`}
          >
            {task.status === 'complete' && <Check size={12} className="xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 animate-scale-in" />}
          </button>
          
          <div className="flex-1 min-w-0">
            <h3
              className={`text-sm xs:text-base sm:text-lg font-semibold transition-all duration-300 truncate ${
                task.status === 'complete'
                  ? 'text-gray-500 line-through'
                  : 'text-gray-800 group-hover:text-gray-900'
              }`}
            >
              {task.name}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 xs:mt-1 flex items-center">
              <span className="w-1 h-1 xs:w-1.5 xs:h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full mr-1.5 xs:mr-2 flex-shrink-0"></span>
              <span className="truncate">Created {task.createdAt.toLocaleDateString()}</span>
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-1 xs:space-x-2 sm:space-x-3 flex-shrink-0">
          <span
            className={`px-1.5 xs:px-2 sm:px-4 py-1 xs:py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
              task.status === 'complete'
                ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200'
                : 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border border-amber-200'
            }`}
          >
            <span className="hidden xs:inline">{task.status === 'complete' ? '✨ Complete' : '⏳ Pending'}</span>
            <span className="xs:hidden">{task.status === 'complete' ? '✨' : '⏳'}</span>
          </span>
          
          <div className="flex space-x-0.5 xs:space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={() => onEdit(task)}
              className="p-1 xs:p-1.5 sm:p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-110"
            >
              <Edit size={12} className="xs:w-3.5 xs:h-3.5 sm:w-[18px] sm:h-[18px]" />
            </button>
            
            <button
              onClick={() => onDelete(task.id)}
              className="p-1 xs:p-1.5 sm:p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110"
            >
              <Trash2 size={12} className="xs:w-3.5 xs:h-3.5 sm:w-[18px] sm:h-[18px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
