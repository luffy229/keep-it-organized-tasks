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
      {/* Floating Particles Background - hidden on mobile for better performance */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float opacity-10 hidden lg:block"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          >
            <Star size={6} className="text-blue-400" />
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 relative z-10">
        {/* Mobile-Optimized Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8 animate-fade-in">
          <div className="relative inline-block mb-3 sm:mb-4 md:mb-6">
            {/* Simplified pulsing effect for mobile */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse opacity-30 sm:opacity-50"></div>
            
            {/* Smaller, more mobile-friendly icon */}
            <div className="relative w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
              <Sparkles size={16} className="sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
            </div>
          </div>

          {/* Compact title for mobile */}
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 sm:mb-3 md:mb-4">
            Your Tasks ✨
          </h1>
          
          {/* Shorter, more concise subtitle */}
          <p className="text-xs sm:text-sm md:text-base text-gray-600 max-w-xs sm:max-w-md mx-auto px-2">
            Stay organized and productive
          </p>

          {/* Compact stats row for mobile */}
          <div className="flex justify-center items-center mt-3 sm:mt-4 space-x-2 sm:space-x-3 px-2">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 shadow-sm flex-1 max-w-[80px] sm:max-w-none">
              <div className="text-sm sm:text-lg font-bold text-blue-600">{taskCounts.all}</div>
              <div className="text-xs text-gray-600">Total</div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 shadow-sm flex-1 max-w-[80px] sm:max-w-none">
              <div className="text-sm sm:text-lg font-bold text-green-600">{taskCounts.complete}</div>
              <div className="text-xs text-gray-600">Done</div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 shadow-sm flex-1 max-w-[80px] sm:max-w-none">
              <div className="text-sm sm:text-lg font-bold text-amber-600">{taskCounts.incomplete}</div>
              <div className="text-xs text-gray-600">Pending</div>
            </div>
          </div>
        </div>

        {/* Compact Filter Section */}
        <div className="mb-3 sm:mb-4 md:mb-6 animate-slide-up px-1 sm:px-0">
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

        {/* Ultra-compact task list for mobile */}
        <div className="max-w-[280px] sm:max-w-sm md:max-w-full mx-auto">
          <div className="space-y-1.5 sm:space-y-2">
            {isLoading ? (
              <div className="text-center py-6 sm:py-8">
                <div className="relative">
                  <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-2 sm:border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
                </div>
                <p className="mt-3 sm:mt-4 text-gray-600 text-sm animate-pulse">Loading tasks...</p>
              </div>
            ) : filteredAndSortedTasks.length === 0 ? (
              <div className="text-center py-6 sm:py-8 md:py-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl sm:rounded-2xl border border-blue-100 relative overflow-hidden animate-fade-in mx-2 sm:mx-0">
                <div className="relative z-10 px-3 sm:px-4">
                  <div className="relative inline-block mb-3 sm:mb-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                      <Sparkles size={20} className="sm:w-7 sm:h-7 text-white" />
                    </div>
                  </div>
                  
                  <h3 className="text-base sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-800 to-purple-600 bg-clip-text text-transparent mb-2 sm:mb-3">
                    Ready to Get Started? 🚀
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 max-w-xs mx-auto">
                    Create your first task and start being productive!
                  </p>
                  
                  <Link 
                    to="/add-task" 
                    className="group inline-flex items-center px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg sm:rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg font-medium text-sm transform hover:scale-105"
                  >
                    <Plus size={14} className="sm:w-4 sm:h-4 mr-1.5 sm:mr-2 group-hover:rotate-90 transition-transform duration-300" />
                    <span>Add Task</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid gap-1.5 sm:gap-2">
                {filteredAndSortedTasks.map((task, index) => (
                  <div
                    key={task.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <TaskCard
                      task={task}
                      onToggleStatus={handleToggleStatus}
                      onDelete={handleDelete}
                      onEdit={handleEdit}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
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
