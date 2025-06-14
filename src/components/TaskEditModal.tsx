
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl max-w-md w-full border border-white/20 animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Edit3 size={20} className="text-white" />
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Edit Task
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="editTaskName" className="block text-sm font-semibold text-gray-700 mb-3">
              ✏️ Task Name
            </label>
            <input
              type="text"
              id="editTaskName"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 shadow-sm"
              placeholder="Enter task name..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              🎯 Status
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="radio"
                  value="incomplete"
                  checked={status === 'incomplete'}
                  onChange={(e) => setStatus(e.target.value as 'incomplete')}
                  className="w-4 h-4 text-amber-500 focus:ring-amber-500 border-gray-300"
                />
                <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-amber-600 transition-colors">
                  ⏳ Incomplete
                </span>
              </label>
              <label className="flex items-center cursor-pointer group">
                <input
                  type="radio"
                  value="complete"
                  checked={status === 'complete'}
                  onChange={(e) => setStatus(e.target.value as 'complete')}
                  className="w-4 h-4 text-green-500 focus:ring-green-500 border-gray-300"
                />
                <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-green-600 transition-colors">
                  ✅ Complete
                </span>
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200/50">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 bg-white/70 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
            >
              <Save size={18} className="mr-2" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskEditModal;
