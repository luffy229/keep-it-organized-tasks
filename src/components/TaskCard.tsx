
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
    <div className="group bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <button
            onClick={() => onToggleStatus(task.id)}
            className="w-6 h-6 mt-1 rounded-full border-2 flex items-center justify-center transition-all duration-300 border-gray-300"
            aria-label={task.status === 'complete' ? "Mark as incomplete" : "Mark as complete"}
          >
            {task.status === 'complete' && <Check size={14} className="text-blue-500" />}
          </button>
          
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-800">
              {task.name}
            </h3>
            <p className="text-sm text-blue-500 mt-1 flex items-center">
              <span>Created {task.createdAt.toLocaleDateString()}</span>
            </p>
          </div>
        </div>
        
        <div className="flex items-center">
          {task.status === 'incomplete' && (
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
