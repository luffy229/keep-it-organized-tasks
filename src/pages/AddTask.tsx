import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Sparkles, Target } from 'lucide-react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import * as api from '@/services/api';

const AddTask = () => {
  const [taskName, setTaskName] = useState('');
  const [status, setStatus] = useState<'complete' | 'incomplete'>('incomplete');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate gradient based on scroll position
  const getBackgroundStyle = () => {
    const maxScroll = 1000;
    const scrollProgress = Math.min(scrollY / maxScroll, 1);
    
    const startColor1 = [199, 210, 254]; // indigo-200
    const startColor2 = [255, 255, 255]; // white
    const startColor3 = [243, 232, 255]; // purple-100
    
    const endColor1 = [147, 197, 253]; // blue-300
    const endColor2 = [196, 181, 253]; // purple-300
    const endColor3 = [252, 165, 165]; // red-300
    
    const interpolateColor = (start: number[], end: number[], progress: number) => {
      return start.map((startVal, i) => 
        Math.round(startVal + (end[i] - startVal) * progress)
      );
    };
    
    const color1 = interpolateColor(startColor1, endColor1, scrollProgress);
    const color2 = interpolateColor(startColor2, endColor2, scrollProgress);
    const color3 = interpolateColor(startColor3, endColor3, scrollProgress);
    
    return {
      background: `linear-gradient(135deg, 
        rgb(${color1.join(',')}) 0%, 
        rgb(${color2.join(',')}) 50%, 
        rgb(${color3.join(',')}) 100%)`
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!taskName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a task name.',
        variant: 'destructive',
      });
      return;
    }

    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to create tasks.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const newTask = await api.createTask(taskName);
      
      // Update status if it's different from default
      if (status === 'complete') {
        await api.updateTaskStatus(newTask.id, 'complete');
      }

      toast({
        title: '🎉 Task created!',
        description: `"${taskName}" has been added to your tasks.`,
      });

      navigate('/');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create task. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen transition-all duration-300" style={getBackgroundStyle()}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-white/20 pointer-events-none"></div>
      
      <Layout>
        <div className="max-w-2xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="mb-6 sm:mb-8 animate-fade-in">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-all duration-200 mb-4 sm:mb-6 group hover:scale-105"
            >
              <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium text-sm sm:text-base">Back to Tasks</span>
            </button>
            
            <div className="text-center mb-6 sm:mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl shadow-lg mb-3 sm:mb-4">
                <Plus size={24} className="sm:hidden text-white" />
                <Plus size={32} className="hidden sm:block text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                ✨ Create New Task
              </h1>
              <p className="text-gray-600 text-base sm:text-lg px-4">Add a new task to stay organized and productive</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-4 sm:p-6 lg:p-8 animate-scale-in">
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              <div className="group">
                <label htmlFor="taskName" className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  🎯 Task Name *
                </label>
                <div className="relative">
                  <Target size={18} className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="text"
                    id="taskName"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    placeholder="What needs to be done? ✨"
                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 shadow-sm hover:shadow-md text-gray-800 placeholder-gray-500 text-sm sm:text-base"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 sm:mb-4">
                  📊 Initial Status
                </label>
                <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
                  <label className="relative cursor-pointer group">
                    <input
                      type="radio"
                      value="incomplete"
                      checked={status === 'incomplete'}
                      onChange={(e) => setStatus(e.target.value as 'incomplete')}
                      className="sr-only"
                      disabled={isSubmitting}
                    />
                    <div className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 ${
                      status === 'incomplete' 
                        ? 'border-amber-400 bg-gradient-to-r from-amber-50 to-orange-50 shadow-lg' 
                        : 'border-gray-200 bg-white/50 hover:border-amber-200 hover:bg-amber-50/50'
                    }`}>
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center ${
                          status === 'incomplete' ? 'border-amber-400 bg-amber-400' : 'border-gray-300'
                        }`}>
                          {status === 'incomplete' && <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 text-sm sm:text-base">⏳ Incomplete</p>
                          <p className="text-xs sm:text-sm text-gray-600">Task is pending completion</p>
                        </div>
                      </div>
                    </div>
                  </label>
                  
                  <label className="relative cursor-pointer group">
                    <input
                      type="radio"
                      value="complete"
                      checked={status === 'complete'}
                      onChange={(e) => setStatus(e.target.value as 'complete')}
                      className="sr-only"
                      disabled={isSubmitting}
                    />
                    <div className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 ${
                      status === 'complete' 
                        ? 'border-green-400 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg' 
                        : 'border-gray-200 bg-white/50 hover:border-green-200 hover:bg-green-50/50'
                    }`}>
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center ${
                          status === 'complete' ? 'border-green-400 bg-green-400' : 'border-gray-300'
                        }`}>
                          {status === 'complete' && <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 text-sm sm:text-base">✅ Complete</p>
                          <p className="text-xs sm:text-sm text-gray-600">Task is already done</p>
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex flex-col space-y-3 sm:flex-row sm:justify-end sm:space-y-0 sm:space-x-4 pt-6 sm:pt-8 mt-8 border-t border-gray-200/50">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="px-4 sm:px-6 py-3 text-gray-700 bg-white/70 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium text-sm sm:text-base order-2 sm:order-1"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !taskName.trim()}
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl font-semibold transform hover:scale-105 order-1 sm:order-2 text-sm sm:text-base"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} className="mr-2 sm:hidden" />
                      <Sparkles size={18} className="mr-2 hidden sm:block" />
                      Create Task
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default AddTask;
