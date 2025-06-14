
import React, { useState, useEffect } from 'react';
import { X, Edit3, Save } from 'lucide-react';
import { Task } from '@/types/Task';

interface TaskEditModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskId: string, name: string, status: 'complete' | 'incomplete') => void;
}

const TaskEditModal = ({ task, isOpen, onClose, onSave }: TaskEditModalProps) => {
  const [taskName, setTaskName] = useState('');
  const [status, setStatus] = useState<'complete' | 'incomplete'>('incomplete');

  useEffect(() => {
    if (task) {
      setTaskName(task.name);
      setStatus(task.status);
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task && taskName.trim()) {
      onSave(task.id, taskName.trim(), status);
      onClose();
    }
  };

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 xs:p-3 sm:p-4 z-50 animate-fade-in">
      <div className="bg-white/90 backdrop-blur-md rounded-xl xs:rounded-2xl shadow-2xl max-w-sm xs:max-w-md w-full border border-white/20 animate-scale-in mx-2">
        <div className="flex items-center justify-between p-3 xs:p-4 sm:p-6 border-b border-gray-200/50">
          <div className="flex items-center space-x-1.5 xs:space-x-2 sm:space-x-3">
            <div className="w-6 h-6 xs:w-8 xs:h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg xs:rounded-xl flex items-center justify-center">
              <Edit3 size={12} className="xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <h2 className="text-base xs:text-lg sm:text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Edit Task
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 xs:p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg xs:rounded-xl transition-all duration-200"
          >
            <X size={14} className="xs:w-4 xs:h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-3 xs:p-4 sm:p-6 space-y-3 xs:space-y-4 sm:space-y-6">
          <div>
            <label htmlFor="editTaskName" className="block text-xs xs:text-sm font-semibold text-gray-700 mb-1.5 xs:mb-2 sm:mb-3">
              ✏️ Task Name
            </label>
            <input
              type="text"
              id="editTaskName"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="w-full px-2.5 xs:px-3 sm:px-4 py-2 xs:py-2.5 sm:py-3 bg-white/70 border border-gray-200 rounded-lg xs:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 shadow-sm text-xs xs:text-sm sm:text-base"
              placeholder="Enter task name..."
              required
            />
          </div>

          <div>
            <label className="block text-xs xs:text-sm font-semibold text-gray-700 mb-1.5 xs:mb-2 sm:mb-3">
              🎯 Status
            </label>
            <div className="flex flex-col space-y-2 xs:space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="radio"
                  value="incomplete"
                  checked={status === 'incomplete'}
                  onChange={(e) => setStatus(e.target.value as 'incomplete')}
                  className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 text-amber-500 focus:ring-amber-500 border-gray-300"
                />
                <span className="ml-1.5 xs:ml-2 sm:ml-3 text-xs xs:text-sm font-medium text-gray-700 group-hover:text-amber-600 transition-colors">
                  ⏳ Incomplete
                </span>
              </label>
              <label className="flex items-center cursor-pointer group">
                <input
                  type="radio"
                  value="complete"
                  checked={status === 'complete'}
                  onChange={(e) => setStatus(e.target.value as 'complete')}
                  className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 text-green-500 focus:ring-green-500 border-gray-300"
                />
                <span className="ml-1.5 xs:ml-2 sm:ml-3 text-xs xs:text-sm font-medium text-gray-700 group-hover:text-green-600 transition-colors">
                  ✅ Complete
                </span>
              </label>
            </div>
          </div>

          <div className="flex flex-col xs:flex-row justify-end space-y-2 xs:space-y-0 xs:space-x-3 pt-2 xs:pt-3 sm:pt-4 border-t border-gray-200/50">
            <button
              type="button"
              onClick={onClose}
              className="px-3 xs:px-4 sm:px-6 py-2 xs:py-2.5 sm:py-3 text-gray-700 bg-white/70 border border-gray-200 rounded-lg xs:rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium text-xs xs:text-sm sm:text-base order-2 xs:order-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center px-3 xs:px-4 sm:px-6 py-2 xs:py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg xs:rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium text-xs xs:text-sm sm:text-base order-1 xs:order-2"
            >
              <Save size={12} className="xs:w-3.5 xs:h-3.5 sm:w-[18px] sm:h-[18px] mr-1.5 xs:mr-2" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskEditModal;
