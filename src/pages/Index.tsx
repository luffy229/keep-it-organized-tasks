import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Sparkles, Star, Zap } from 'lucide-react';
import Layout from '@/components/Layout';
import TaskCard from '@/components/TaskCard';
import TaskFilter from '@/components/TaskFilter';
import TaskEditModal from '@/components/TaskEditModal';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Task, TaskStatus, SortBy, SortOrder } from '@/types/Task';
import * as api from '@/services/api';

const Index = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [filter, setFilter] = useState<TaskStatus>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch tasks on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const fetchedTasks = await api.getTasks();
        setTasks(fetchedTasks);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch tasks. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchTasks();
    }
  }, [user, toast]);

  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks;

    // Apply status filter
    if (filter !== 'all') {
      filtered = filtered.filter(task => task.status === filter);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy];
      let bValue: any = b[sortBy];

      if (sortBy === 'createdAt') {
        aValue = a.createdAt.getTime();
        bValue = b.createdAt.getTime();
      } else if (sortBy === 'status') {
        aValue = a.status === 'complete' ? 1 : 0;
        bValue = b.status === 'complete' ? 1 : 0;
      } else {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [tasks, filter, searchTerm, sortBy, sortOrder]);

  const taskCounts = {
    all: tasks.length,
    complete: tasks.filter(task => task.status === 'complete').length,
    incomplete: tasks.filter(task => task.status === 'incomplete').length,
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const task = tasks.find(t => t.id === id);
      if (task) {
        const newStatus = task.status === 'complete' ? 'incomplete' : 'complete';
        const updatedTask = await api.updateTaskStatus(id, newStatus);
        setTasks(tasks.map(t => t.id === id ? updatedTask : t));
        toast({
          title: newStatus === 'complete' ? '🎉 Task completed!' : '🔄 Task reopened',
          description: `"${task.name}" has been marked as ${newStatus}.`,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update task status. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const task = tasks.find(t => t.id === id);
      if (task) {
        await api.deleteTask(id);
        setTasks(tasks.filter(t => t.id !== id));
        toast({
          title: '🗑️ Task deleted',
          description: `"${task.name}" has been removed.`,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete task. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
  };

  const handleSaveEdit = async (taskId: string, name: string, status: 'complete' | 'incomplete') => {
    try {
      const updatedTask = await api.updateTask(taskId, name, status);
      setTasks(tasks.map(t => t.id === taskId ? updatedTask : t));
      toast({
        title: '✨ Task updated!',
        description: 'Your task has been successfully updated.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update task. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-600/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-gradient-to-r from-cyan-400/20 to-blue-600/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Header with Enhanced Animations */}
        <div className="text-center mb-8 sm:mb-12 animate-fade-in relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 rounded-3xl shadow-2xl mb-6 animate-float hover:scale-110 transition-all duration-300 group">
            <Sparkles size={36} className="text-white group-hover:animate-spin transition-transform duration-500" />
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-pulse flex items-center justify-center">
              <Star size={12} className="text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold bg-gradient-to-r from-gray-800 via-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 animate-gradient bg-[length:300%_300%] hover:scale-105 transition-transform duration-300">
            Your Tasks ✨
          </h1>
          
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="text-yellow-500 animate-pulse" size={24} />
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto font-medium">
              Stay organized and productive with your personalized task management
            </p>
            <Zap className="text-yellow-500 animate-pulse" size={24} />
          </div>
          
          {/* Stats Cards */}
          <div className="flex justify-center gap-4 mt-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/20">
              <div className="text-2xl font-bold text-blue-600">{taskCounts.all}</div>
              <div className="text-sm text-gray-600">Total Tasks</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/20">
              <div className="text-2xl font-bold text-green-600">{taskCounts.complete}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/20">
              <div className="text-2xl font-bold text-amber-600">{taskCounts.incomplete}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
          </div>
        </div>

        {/* Filter Section with Enhanced Effects */}
        <div className="mb-8 sm:mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <TaskFilter
            currentFilter={filter}
            onFilterChange={setFilter}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
            taskCounts={taskCounts}
          />
        </div>

        {/* Tasks List with Stagger Animation */}
        <div className="space-y-4 relative z-10">
          {isLoading ? (
            <div className="text-center py-12 animate-fade-in">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-gradient-to-r from-blue-500 to-purple-600 border-t-transparent mx-auto"></div>
                <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-2 border-blue-300 mx-auto"></div>
              </div>
              <p className="mt-6 text-gray-600 text-lg font-medium">Loading your awesome tasks...</p>
            </div>
          ) : filteredAndSortedTasks.length === 0 ? (
            <div className="text-center py-16 bg-gradient-to-br from-blue-50/80 to-purple-50/80 backdrop-blur-sm rounded-3xl border-2 border-dashed border-blue-200 animate-fade-in hover:scale-105 transition-all duration-500 relative overflow-hidden">
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 left-4 w-8 h-8 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="absolute top-8 right-8 w-6 h-6 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute bottom-8 left-8 w-10 h-10 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-4 right-4 w-7 h-7 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }}></div>
              </div>
              
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 rounded-full shadow-2xl mb-6 animate-float group hover:scale-110 transition-all duration-300">
                  <Sparkles size={48} className="text-white group-hover:animate-spin transition-transform duration-500" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-3 animate-pulse">No tasks yet!</h3>
                <p className="text-gray-600 text-xl mb-8 font-medium">Start organizing your life by creating your first task</p>
                <Link 
                  to="/add-task" 
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 text-white rounded-2xl hover:from-blue-600 hover:via-purple-700 hover:to-pink-600 transition-all duration-300 shadow-2xl hover:shadow-3xl font-bold text-xl transform hover:scale-110 hover:-translate-y-1 group"
                >
                  <Plus size={24} className="mr-3 group-hover:rotate-90 transition-transform duration-300" />
                  Create Your First Task
                  <Star size={20} className="ml-3 animate-pulse" />
                </Link>
              </div>
            </div>
          ) : (
            filteredAndSortedTasks.map((task, index) => (
              <div 
                key={task.id} 
                className="animate-slide-up hover:animate-scale-in"
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  animationFillMode: 'both'
                }}
              >
                <TaskCard
                  task={task}
                  onToggleStatus={handleToggleStatus}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              </div>
            ))
          )}
        </div>

        {/* Floating Action Button */}
        <Link
          to="/add-task"
          className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 rounded-full shadow-2xl hover:shadow-3xl flex items-center justify-center text-white font-bold text-xl transform hover:scale-110 transition-all duration-300 z-50 animate-float group"
        >
          <Plus size={28} className="group-hover:rotate-90 transition-transform duration-300" />
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full animate-pulse flex items-center justify-center">
            <span className="text-xs">!</span>
          </div>
        </Link>
      </div>

      {/* Edit Modal */}
      {editingTask && (
        <TaskEditModal
          task={editingTask}
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          onSave={handleSaveEdit}
        />
      )}
    </Layout>
  );
};

export default Index;
