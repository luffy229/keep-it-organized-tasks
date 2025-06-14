
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
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 relative overflow-hidden">
      {/* Completion celebration effect */}
      {task.status === 'complete' && (
        <div className="absolute top-4 right-4">
          <Sparkles size={24} className="text-yellow-500" />
        </div>
      )}
      
      <div className="flex items-start justify-between relative z-10">
        <div className="flex items-start space-x-4 flex-1">
          <button
            onClick={() => onToggleStatus(task.id)}
            className={`w-8 h-8 mt-1 rounded-full border-2 flex items-center justify-center ${
              task.status === 'complete' 
                ? 'bg-gradient-to-r from-green-400 to-emerald-500 border-green-400' 
                : 'border-gray-300'
            }`}
            aria-label={task.status === 'complete' ? "Mark as incomplete" : "Mark as complete"}
          >
            {task.status === 'complete' && (
              <Check size={18} className="text-white" />
            )}
          </button>
          
          <div className="flex-1">
            <h3 className={`text-lg font-semibold ${
              task.status === 'complete' 
                ? 'line-through text-gray-500 opacity-60' 
                : 'text-gray-800'
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
            <div className="px-4 py-2 rounded-full text-amber-700 bg-gradient-to-r from-amber-100 to-yellow-100 text-sm font-semibold ml-2 border border-amber-200">
              <div className="flex items-center">
                <span className="mr-2">⏳</span>
                Pending
              </div>
            </div>
          )}
          
          {task.status === 'complete' && (
            <div className="px-4 py-2 rounded-full text-green-700 bg-gradient-to-r from-green-100 to-emerald-100 text-sm font-semibold ml-2 border border-green-200">
              <div className="flex items-center">
                <span className="mr-2">✅</span>
                Complete
              </div>
            </div>
          )}
          
          <div className="flex space-x-1 ml-3">
            <button
              onClick={() => onEdit(task)}
              className="p-3 text-gray-400 rounded-xl"
              aria-label="Edit task"
            >
              <Edit size={18} />
            </button>
            
            <button
              onClick={() => onDelete(task.id)}
              className="p-3 text-gray-400 rounded-xl"
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
