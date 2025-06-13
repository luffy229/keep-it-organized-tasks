
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import Layout from '@/components/Layout';
import { addTask } from '@/utils/taskStorage';
import { useToast } from '@/hooks/use-toast';

const AddTask = () => {
  const [taskName, setTaskName] = useState('');
  const [status, setStatus] = useState<'complete' | 'incomplete'>('incomplete');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

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

    setIsSubmitting(true);

    try {
      const newTask = addTask(taskName);
      
      // Update status if it's different from default
      if (status === 'complete') {
        const { updateTaskStatus } = await import('@/utils/taskStorage');
        updateTaskStatus(newTask.id, 'complete');
      }

      toast({
        title: 'Task created!',
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
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Tasks
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900">Add New Task</h1>
          <p className="text-gray-600 mt-1">Create a new task to add to your list</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="taskName" className="block text-sm font-medium text-gray-700 mb-2">
                Task Name *
              </label>
              <input
                type="text"
                id="taskName"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="Enter your task..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Initial Status
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="incomplete"
                    checked={status === 'incomplete'}
                    onChange={(e) => setStatus(e.target.value as 'incomplete')}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    disabled={isSubmitting}
                  />
                  <span className="ml-2 text-sm text-gray-900">Incomplete</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="complete"
                    checked={status === 'complete'}
                    onChange={(e) => setStatus(e.target.value as 'complete')}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    disabled={isSubmitting}
                  />
                  <span className="ml-2 text-sm text-gray-900">Complete</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !taskName.trim()}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus size={20} className="mr-2" />
                {isSubmitting ? 'Creating...' : 'Create Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AddTask;
