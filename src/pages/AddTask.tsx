
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { saveTask } from '@/utils/taskStorage';
import { Task } from '@/types/Task';
import { Plus, ArrowLeft, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const AddTask = () => {
  const [taskName, setTaskName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName.trim() || !user) return;

    setIsSubmitting(true);
    
    try {
      const newTask: Task = {
        id: Date.now().toString(),
        name: taskName.trim(),
        status: 'incomplete',
        createdAt: new Date(),
        userId: user.id,
      };

      saveTask(newTask);
      navigate('/');
    } catch (error) {
      console.error('Error adding task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen px-2 sm:px-4 md:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4 sm:mb-6">
            <div className="relative">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                <Plus size={24} className="text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-6 sm:h-6 bg-yellow-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Add New Task
              </h1>
              <p className="text-xs sm:text-sm text-gray-500">Create something amazing ✨</p>
            </div>
          </div>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-lg mx-auto px-4">
            What would you like to accomplish today?
          </p>
        </div>

        {/* Back Button */}
        <div className="mb-6 sm:mb-8">
          <Link
            to="/"
            className="inline-flex items-center px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-600 hover:text-gray-900 bg-white/70 backdrop-blur-sm rounded-lg sm:rounded-xl hover:bg-white/80 transition-all duration-300 shadow-sm hover:shadow-md border border-white/20"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Tasks
          </Link>
        </div>

        {/* Form Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-xl sm:rounded-2xl shadow-2xl border border-white/20 p-6 sm:p-8 lg:p-10 animate-scale-in">
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            <div className="group">
              <label htmlFor="taskName" className="block text-sm sm:text-base font-semibold text-gray-700 mb-3 sm:mb-4">
                ✏️ Task Name
              </label>
              <div className="relative">
                <Sparkles size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  id="taskName"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 sm:py-5 bg-white/70 border border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 shadow-sm hover:shadow-md text-sm sm:text-base placeholder-gray-500"
                  placeholder="Enter your task description..."
                  required
                  disabled={isSubmitting}
                  maxLength={200}
                />
              </div>
              <div className="flex justify-between items-center mt-2 px-1">
                <p className="text-xs sm:text-sm text-gray-500">
                  💡 Be specific and actionable
                </p>
                <span className="text-xs text-gray-400">
                  {taskName.length}/200
                </span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-200">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Sparkles size={16} className="text-white" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-2">
                    🎯 Tips for Great Tasks
                  </h3>
                  <ul className="text-xs sm:text-sm text-gray-600 space-y-1">
                    <li>• Start with action words (Write, Call, Review)</li>
                    <li>• Be specific about what you want to accomplish</li>
                    <li>• Keep it focused on a single objective</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
              <Link
                to="/"
                className="flex-1 px-6 py-3 sm:py-4 text-center text-sm sm:text-base font-medium text-gray-700 bg-white/70 border border-gray-200 rounded-xl sm:rounded-2xl hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md order-2 sm:order-1"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={!taskName.trim() || isSubmitting}
                className="flex-1 inline-flex items-center justify-center px-6 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl sm:rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 order-1 sm:order-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus size={18} className="mr-2" />
                    Create Task
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Motivational Quote */}
        <div className="text-center mt-8 sm:mt-12">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-white/20 p-4 sm:p-6 max-w-lg mx-auto">
            <p className="text-sm sm:text-base text-gray-700 italic">
              "The secret to getting ahead is getting started."
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">— Mark Twain</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTask;
