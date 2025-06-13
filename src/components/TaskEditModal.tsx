
import React, { useState, useEffect } from 'react';
import { X, Edit3, Sparkles } from 'lucide-react';
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
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl"></div>
        
        {/* Header */}
        <div className="relative flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Edit3 size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Edit Task
              </h2>
              <p className="text-sm text-gray-500">Make your task perfect</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="relative p-6 space-y-6">
          <div>
            <label htmlFor="editTaskName" className="block text-sm font-semibold text-gray-700 mb-3">
              Task Name
            </label>
            <div className="relative">
              <input
                type="text"
                id="editTaskName"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white/80"
                placeholder="Enter your amazing task..."
                required
              />
              <Sparkles size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Status
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className={`relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                status === 'incomplete' 
                  ? 'border-orange-300 bg-orange-50' 
                  : 'border-gray-200 bg-white hover:bg-gray-50'
              }`}>
                <input
                  type="radio"
                  value="incomplete"
                  checked={status === 'incomplete'}
                  onChange={(e) => setStatus(e.target.value as 'incomplete')}
                  className="sr-only"
                />
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    status === 'incomplete' ? 'border-orange-500 bg-orange-500' : 'border-gray-300'
                  }`}>
                    {status === 'incomplete' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">⏳ Pending</span>
                    <p className="text-xs text-gray-500">Not completed yet</p>
                  </div>
                </div>
              </label>

              <label className={`relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                status === 'complete' 
                  ? 'border-green-300 bg-green-50' 
                  : 'border-gray-200 bg-white hover:bg-gray-50'
              }`}>
                <input
                  type="radio"
                  value="complete"
                  checked={status === 'complete'}
                  onChange={(e) => setStatus(e.target.value as 'complete')}
                  className="sr-only"
                />
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    status === 'complete' ? 'border-green-500 bg-green-500' : 'border-gray-300'
                  }`}>
                    {status === 'complete' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">✅ Complete</span>
                    <p className="text-xs text-gray-500">Task finished</p>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg transform hover:scale-105"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskEditModal;
