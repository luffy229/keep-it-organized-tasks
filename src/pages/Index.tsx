
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Sparkles, Trophy, Target } from 'lucide-react';
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
      title: newStatus === 'complete' ? '🎉 Task completed!' : '🔄 Task reopened',
      description: `"${task.name}" has been ${newStatus === 'complete' ? 'completed' : 'marked incomplete'}.`,
    });
  };

  const handleDelete = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    deleteTask(id);
    setTasks(loadTasks(user?.id));

    toast({
      title: '🗑️ Task deleted',
      description: `"${task.name}" has been removed from your list.`,
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
      if (filter !== 'all' && task.status !== filter) return false;
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

  const completionRate = tasks.length > 0 ? Math.round((taskCounts.complete / tasks.length) * 100) : 0;

  return (
    <Layout>
      <div className="space-y-8">
        {/* Enhanced Header Section */}
        <div className="relative">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full">
              <Sparkles size={20} className="text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Welcome back, {user?.name}!</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Your Task Universe
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Transform your productivity with beautifully organized tasks
            </p>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 max-w-2xl mx-auto">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Total Tasks</p>
                    <p className="text-2xl font-bold">{taskCounts.all}</p>
                  </div>
                  <Target size={32} className="text-blue-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Completed</p>
                    <p className="text-2xl font-bold">{taskCounts.complete}</p>
                  </div>
                  <Trophy size={32} className="text-green-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl p-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Completion</p>
                    <p className="text-2xl font-bold">{completionRate}%</p>
                  </div>
                  <Sparkles size={32} className="text-purple-200" />
                </div>
              </div>
            </div>
          </div>
          
          <Link
            to="/add-task"
            className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full p-4 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 z-50 group"
          >
            <Plus size={24} />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
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

        {/* Tasks Section */}
        {filteredAndSortedTasks.length === 0 ? (
          <div className="text-center py-16">
            <div className="relative inline-block">
              <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <Plus size={32} className="text-gray-400" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur opacity-20"></div>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {searchTerm ? 'No matching tasks found' : 
               filter === 'all' ? 'Ready to start your journey?' : `No ${filter} tasks`}
            </h3>
            
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              {searchTerm ? `No tasks match "${searchTerm}". Try a different search term.` :
               filter === 'all' 
                ? "Create your first task and begin achieving your goals!"
                : `You don't have any ${filter} tasks right now.`
              }
            </p>
            
            {!searchTerm && filter === 'all' && (
              <Link
                to="/add-task"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Plus size={20} className="mr-2" />
                Create Your First Task
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAndSortedTasks.map((task, index) => (
              <div 
                key={task.id} 
                className="animate-fade-in"
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
