
import React from 'react';
import { Check, Trash2, Edit, Sparkles } from 'lucide-react';
import { Task } from '@/types/Task';

interface TaskCardProps {
  task: Task;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

const TaskCard = ({ task, onToggleStatus, onDelete, onEdit }: TaskCardProps) => {
  return (
    <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 border border-white/20 relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Completion celebration effect */}
      {task.status === 'complete' && (
        <div className="absolute top-4 right-4 animate-bounce">
          <Sparkles size={24} className="text-yellow-500 animate-pulse" />
        </div>
      )}
      
      <div className="flex items-start justify-between relative z-10">
        <div className="flex items-start space-x-4 flex-1">
          <button
            onClick={() => onToggleStatus(task.id)}
            className={`w-8 h-8 mt-1 rounded-full border-2 flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${
              task.status === 'complete' 
                ? 'bg-gradient-to-r from-green-400 to-emerald-500 border-green-400 shadow-lg animate-pulse' 
                : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
            }`}
            aria-label={task.status === 'complete' ? "Mark as incomplete" : "Mark as complete"}
          >
            {task.status === 'complete' && (
              <Check size={18} className="text-white animate-scale-in" />
            )}
          </button>
          
          <div className="flex-1">
            <h3 className={`text-lg font-semibold transition-all duration-500 ${
              task.status === 'complete' 
                ? 'line-through text-gray-500 opacity-60 transform scale-95' 
                : 'text-gray-800 group-hover:text-blue-600'
            }`}>
              {task.name}
            </h3>
            <p className="text-sm text-blue-500 mt-2 flex items-center font-medium">
              <span className="mr-2">📅</span>
              Created {task.createdAt.toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div className="flex items-center">
          {task.status === 'incomplete' && (
            <div className="px-4 py-2 rounded-full text-amber-700 bg-gradient-to-r from-amber-100 to-yellow-100 text-sm font-semibold ml-2 animate-pulse border border-amber-200">
              <div className="flex items-center">
                <span className="mr-2 animate-spin">⏳</span>
                Pending
              </div>
            </div>
          )}
          
          {task.status === 'complete' && (
            <div className="px-4 py-2 rounded-full text-green-700 bg-gradient-to-r from-green-100 to-emerald-100 text-sm font-semibold ml-2 border border-green-200 animate-fade-in">
              <div className="flex items-center">
                <span className="mr-2">✅</span>
                Complete
              </div>
            </div>
          )}
          
          <div className="flex space-x-1 ml-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-105">
            <button
              onClick={() => onEdit(task)}
              className="p-3 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all duration-200 transform hover:scale-110 hover:rotate-3 shadow-sm hover:shadow-md"
              aria-label="Edit task"
            >
              <Edit size={18} />
            </button>
            
            <button
              onClick={() => onDelete(task.id)}
              className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 transform hover:scale-110 hover:-rotate-3 shadow-sm hover:shadow-md"
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
