
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Sparkles } from 'lucide-react';
import Layout from '@/components/Layout';
import TaskCard from '@/components/TaskCard';
import TaskFilter from '@/components/TaskFilter';
import TaskEditModal from '@/components/TaskEditModal';
import { getUserTasks, updateTaskStatus, deleteTask, updateTask } from '@/utils/taskStorage';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Task, TaskStatus, SortBy, SortOrder } from '@/types/Task';

const Index = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [filter, setFilter] = useState<TaskStatus>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const tasks = user ? getUserTasks(user.id) : [];

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

  const handleToggleStatus = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      const newStatus = task.status === 'complete' ? 'incomplete' : 'complete';
      updateTaskStatus(id, newStatus);
      toast({
        title: newStatus === 'complete' ? '🎉 Task completed!' : '🔄 Task reopened',
        description: `"${task.name}" has been marked as ${newStatus}.`,
      });
    }
  };

  const handleDelete = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      deleteTask(id);
      toast({
        title: '🗑️ Task deleted',
        description: `"${task.name}" has been removed.`,
      });
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
  };

  const handleSaveEdit = (taskId: string, name: string, status: 'complete' | 'incomplete') => {
    updateTask(taskId, name, status);
    toast({
      title: '✨ Task updated!',
      description: 'Your task has been successfully updated.',
    });
  };

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-xl mb-6">
            <Sparkles size={32} className="text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Your Tasks ✨
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Stay organized and productive with your personalized task management
          </p>
        </div>

        {/* Filter Section */}
        <div className="mb-8 sm:mb-12">
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

        {/* Tasks Grid */}
        <div className="space-y-6 sm:space-y-8 mb-8">
          {filteredAndSortedTasks.length === 0 ? (
            <div className="text-center py-12 sm:py-16 animate-fade-in">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8 sm:p-12 max-w-lg mx-auto">
                <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">📝</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
                  {searchTerm ? 'No matching tasks found' : 'No tasks yet'}
                </h3>
                <p className="text-gray-600 mb-8">
                  {searchTerm 
                    ? `Try adjusting your search or filter criteria`
                    : `Ready to get organized? Create your first task!`}
                </p>
                {!searchTerm && (
                  <Link
                    to="/add-task"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold transform hover:scale-105"
                  >
                    <Plus size={20} className="mr-2" />
                    Create Your First Task
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-6 lg:gap-8">
              {filteredAndSortedTasks.map((task, index) => (
                <div
                  key={task.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
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

        {/* Floating Add Button for Mobile */}
        <Link
          to="/add-task"
          className="fixed bottom-6 right-6 sm:hidden w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-110 z-50"
        >
          <Plus size={24} />
        </Link>

        {/* Desktop Add Button */}
        <div className="hidden sm:flex justify-center mt-12">
          <Link
            to="/add-task"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold text-lg transform hover:scale-105"
          >
            <Plus size={24} className="mr-3" />
            Add New Task
          </Link>
        </div>
      </div>

      <TaskEditModal
        task={editingTask}
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        onSave={handleSaveEdit}
      />
    </Layout>
  );
};

export default Index;
