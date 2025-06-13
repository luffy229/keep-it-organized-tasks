
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Star, Target, Trophy } from 'lucide-react';
import Layout from '@/components/Layout';
import TaskCard from '@/components/TaskCard';
import TaskFilter from '@/components/TaskFilter';
import TaskEditModal from '@/components/TaskEditModal';
import { Task, TaskStatus, SortBy, SortOrder } from '@/types/Task';
import { loadTasks, updateTaskStatus, deleteTask, updateTask } from '@/utils/taskStorage';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskStatus>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      setTasks(loadTasks(user.id));
    }
  }, [user]);

  const handleToggleStatus = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const newStatus = task.status === 'complete' ? 'incomplete' : 'complete';
    updateTaskStatus(id, newStatus);
    setTasks(loadTasks(user?.id));

    toast({
      title: newStatus === 'complete' ? '🎉 Task completed!' : '📝 Task marked incomplete',
      description: `"${task.name}" has been updated.`,
    });
  };

  const handleDelete = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    deleteTask(id);
    setTasks(loadTasks(user?.id));

    toast({
      title: '🗑️ Task deleted',
      description: `"${task.name}" has been removed.`,
      variant: 'destructive',
    });
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (taskId: string, name: string, status: 'complete' | 'incomplete') => {
    updateTask(taskId, name, status);
    setTasks(loadTasks(user?.id));
    
    toast({
      title: '✨ Task updated!',
      description: 'Your task has been successfully updated.',
    });
  };

  // Filter and sort tasks
  const filteredAndSortedTasks = tasks
    .filter(task => {
      // Filter by status
      if (filter !== 'all' && task.status !== filter) return false;
      
      // Filter by search term
      if (searchTerm && !task.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'createdAt':
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const taskCounts = {
    all: tasks.length,
    complete: tasks.filter(t => t.status === 'complete').length,
    incomplete: tasks.filter(t => t.status === 'incomplete').length,
  };

  const completionPercentage = tasks.length > 0 ? Math.round((taskCounts.complete / tasks.length) * 100) : 0;

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Welcome back, {user?.name}! 👋
              </h1>
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-bounce"></div>
            </div>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Manage your daily tasks efficiently and stay productive ✨
          </p>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 backdrop-blur-sm rounded-2xl p-4 border border-blue-200/20">
              <div className="flex items-center justify-center space-x-2">
                <Target className="text-blue-500" size={24} />
                <span className="text-2xl font-bold text-blue-600">{taskCounts.all}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Total Tasks</p>
            </div>
            
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-sm rounded-2xl p-4 border border-green-200/20">
              <div className="flex items-center justify-center space-x-2">
                <Trophy className="text-green-500" size={24} />
                <span className="text-2xl font-bold text-green-600">{taskCounts.complete}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Completed</p>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-2xl p-4 border border-purple-200/20">
              <div className="flex items-center justify-center space-x-2">
                <Star className="text-purple-500" size={24} />
                <span className="text-2xl font-bold text-purple-600">{completionPercentage}%</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Progress</p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <Link
            to="/add-task"
            className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-medium"
          >
            <Plus size={24} className="mr-3 group-hover:rotate-90 transition-transform duration-300" />
            Create New Task
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
          </Link>
        </div>

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

        {filteredAndSortedTasks.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Plus size={32} className="text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {searchTerm ? 'No matching tasks found 🔍' : 
               filter === 'all' ? 'No tasks yet 📝' : `No ${filter} tasks 🎯`}
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto text-lg">
              {searchTerm ? `No tasks match "${searchTerm}". Try a different search term.` :
               filter === 'all' 
                ? "Ready to get organized? Create your first task and start being productive!"
                : `You don't have any ${filter} tasks right now. Keep up the good work!`
              }
            </p>
            {!searchTerm && filter === 'all' && (
              <Link
                to="/add-task"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
              >
                <Plus size={20} className="mr-2" />
                Add Your First Task
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAndSortedTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))}
          </div>
        )}

        <TaskEditModal
          task={editingTask}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingTask(null);
          }}
          onSave={handleSaveEdit}
        />
      </div>
    </Layout>
  );
};

export default Index;
