import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Sparkles, Star } from 'lucide-react';
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
      {/* Floating Particles Background - responsive */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          >
            <Star size={8 + Math.random() * 8} className="text-blue-400 lg:w-4 lg:h-4 xl:w-5 xl:h-5" />
          </div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-4 lg:px-6 xl:px-8 relative z-10">
        {/* Enhanced Header with Responsive Design */}
        <div className="text-center mb-8 lg:mb-12 animate-fade-in">
          <div className="relative inline-block mb-6 lg:mb-8">
            {/* Pulsing Ring Effect - responsive sizing */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-ping opacity-75"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse opacity-50"></div>
            
            {/* Main Icon - responsive sizing */}
            <div className="relative w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 rounded-full flex items-center justify-center shadow-2xl animate-float">
              <Sparkles size={28} className="lg:hidden text-white animate-pulse" />
              <Sparkles size={36} className="hidden lg:block text-white animate-pulse" />
              
              {/* Orbiting Stars - responsive sizing */}
              <div className="absolute inset-0 animate-spin" style={{ animationDuration: '8s' }}>
                <Star size={6} className="lg:w-2 lg:h-2 absolute -top-1 left-1/2 transform -translate-x-1/2 text-yellow-400" />
                <Star size={4} className="lg:w-1.5 lg:h-1.5 absolute top-1/2 -right-1 transform -translate-y-1/2 text-pink-400" />
                <Star size={6} className="lg:w-2 lg:h-2 absolute -bottom-1 left-1/2 transform -translate-x-1/2 text-blue-400" />
                <Star size={4} className="lg:w-1.5 lg:h-1.5 absolute top-1/2 -left-1 transform -translate-y-1/2 text-purple-400" />
              </div>
            </div>
          </div>

          {/* Animated Title - responsive sizing */}
          <h1 className="text-3xl lg:text-5xl xl:text-7xl font-bold bg-gradient-to-r from-gray-800 via-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 lg:mb-6 animate-gradient bg-[length:300%_300%]">
            Your Tasks ✨
          </h1>
          
          {/* Subtitle - responsive sizing */}
          <p className="text-base lg:text-lg xl:text-xl text-gray-600 max-w-2xl mx-auto animate-slide-up px-4">
            Stay organized and productive with your 
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold"> personalized task management</span>
          </p>

          {/* Stats Cards - responsive layout and sizing */}
          <div className="flex flex-col space-y-3 lg:flex-row lg:justify-center lg:mt-6 lg:space-y-0 lg:space-x-4 mt-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 lg:px-6 lg:py-4 shadow-lg hover:shadow-xl transition-all duration-300 animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-2xl lg:text-2xl font-bold text-blue-600">{taskCounts.all}</div>
              <div className="text-sm lg:text-sm text-gray-600">Total Tasks</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 lg:px-6 lg:py-4 shadow-lg hover:shadow-xl transition-all duration-300 animate-scale-in" style={{ animationDelay: '0.4s' }}>
              <div className="text-2xl lg:text-2xl font-bold text-green-600">{taskCounts.complete}</div>
              <div className="text-sm lg:text-sm text-gray-600">Completed</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 lg:px-6 lg:py-4 shadow-lg hover:shadow-xl transition-all duration-300 animate-scale-in" style={{ animationDelay: '0.6s' }}>
              <div className="text-2xl lg:text-2xl font-bold text-amber-600">{taskCounts.incomplete}</div>
              <div className="text-sm lg:text-sm text-gray-600">Pending</div>
            </div>
          </div>
        </div>

        {/* Enhanced Filter Section - responsive spacing */}
        <div className="mb-8 lg:mb-12 animate-slide-up" style={{ animationDelay: '0.8s' }}>
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

        {/* Tasks List - responsive spacing */}
        <div className="space-y-4 lg:space-y-4">
          {isLoading ? (
            <div className="text-center py-12 lg:py-12">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 lg:h-16 lg:w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
                <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 lg:h-16 lg:w-16 border-2 border-blue-400 opacity-75 mx-auto"></div>
              </div>
              <p className="mt-6 lg:mt-6 text-gray-600 text-lg lg:text-lg animate-pulse">Loading your amazing tasks...</p>
            </div>
          ) : filteredAndSortedTasks.length === 0 ? (
            <div className="text-center py-16 lg:py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-3xl lg:rounded-3xl border-2 border-dashed border-gradient-to-r border-blue-200 relative overflow-hidden animate-fade-in">
              {/* Background Pattern - responsive sizing */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-10 left-10 w-20 h-20 lg:w-20 lg:h-20 bg-blue-500 rounded-full animate-pulse"></div>
                <div className="absolute top-20 right-20 w-16 h-16 lg:w-16 lg:h-16 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-20 left-20 w-12 h-12 lg:w-12 lg:h-12 bg-pink-500 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
              </div>
              
              <div className="relative z-10">
                <div className="relative inline-block mb-8 lg:mb-8">
                  <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
                    <Sparkles size={40} className="lg:hidden text-white" />
                    <Sparkles size={48} className="hidden lg:block text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 lg:w-8 lg:h-8 bg-yellow-400 rounded-full animate-ping"></div>
                </div>
                
                <h3 className="text-2xl lg:text-2xl xl:text-3xl font-bold bg-gradient-to-r from-gray-800 to-purple-600 bg-clip-text text-transparent mb-4 lg:mb-4">
                  Ready to Get Things Done? 🚀
                </h3>
                <p className="text-gray-600 text-lg lg:text-lg xl:text-xl mb-8 lg:mb-8 max-w-md mx-auto px-4">
                  Your productivity journey starts with your first task. Let's make it happen!
                </p>
                
                <Link 
                  to="/add-task" 
                  className="group inline-flex items-center px-8 py-4 lg:px-8 lg:py-4 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 text-white rounded-2xl lg:rounded-2xl hover:from-blue-600 hover:via-purple-700 hover:to-pink-600 transition-all duration-300 shadow-2xl hover:shadow-3xl font-semibold text-lg lg:text-lg transform hover:scale-105 hover:-translate-y-1"
                >
                  <Plus size={24} className="lg:hidden mr-3 group-hover:rotate-90 transition-transform duration-300" />
                  <Plus size={24} className="hidden lg:block mr-3 group-hover:rotate-90 transition-transform duration-300" />
                  Create Your First Task
                  <div className="ml-3 lg:ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">✨</div>
                </Link>
              </div>
            </div>
          ) : (
            filteredAndSortedTasks.map((task, index) => (
              <div
                key={task.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
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
