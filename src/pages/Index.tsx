import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserTasks, toggleTaskStatus, deleteTask, saveTask } from '@/utils/taskStorage';
import { Task, TaskStatus, SortBy, SortOrder } from '@/types/Task';
import TaskCard from '@/components/TaskCard';
import TaskFilter from '@/components/TaskFilter';
import TaskEditModal from '@/components/TaskEditModal';
import { Plus, CheckCircle, Clock, List } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentFilter, setCurrentFilter] = useState<TaskStatus>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadTasks();
    }
  }, [user, currentFilter, searchTerm, sortBy, sortOrder]);

  const loadTasks = () => {
    let userTasks = getUserTasks(user!.id);

    // Apply filtering
    if (currentFilter !== 'all') {
      userTasks = userTasks.filter(task => task.status === currentFilter);
    }

    // Apply search
    if (searchTerm) {
      userTasks = userTasks.filter(task =>
        task.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    userTasks.sort((a, b) => {
      let comparison = 0;

      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === 'status') {
        if (a.status === 'complete' && b.status === 'incomplete') {
          comparison = 1;
        } else if (a.status === 'incomplete' && b.status === 'complete') {
          comparison = -1;
        }
      } else if (sortBy === 'createdAt') {
        comparison = a.createdAt.getTime() - b.createdAt.getTime();
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setTasks(userTasks);
  };

  const handleToggleStatus = (id: string) => {
    toggleTaskStatus(id);
    loadTasks();
  };

  const handleDeleteTask = (id: string) => {
    deleteTask(id);
    loadTasks();
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleSaveTask = (taskId: string, name: string, status: 'complete' | 'incomplete') => {
    if (editingTask) {
      const updatedTask: Task = {
        ...editingTask,
        name: name,
        status: status,
      };
      saveTask(updatedTask);
      setEditingTask(null);
      loadTasks();
    }
  };

  const taskCounts = {
    all: tasks.length,
    complete: tasks.filter(task => task.status === 'complete').length,
    incomplete: tasks.filter(task => task.status === 'incomplete').length,
  };

  const filteredTasks = tasks;

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen px-2 sm:px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto py-4 sm:py-6 lg:py-8">
        {/* Header Section */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 sm:mb-4">
            ✨ Welcome back, {user.name}!
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Manage your tasks efficiently and stay organized
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-white/20 p-4 sm:p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Tasks</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">{taskCounts.all}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <List size={20} className="text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-white/20 p-4 sm:p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Completed</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600">{taskCounts.complete}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                <CheckCircle size={20} className="text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-white/20 p-4 sm:p-6 hover:shadow-xl transition-all duration-300 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Pending</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-amber-600">{taskCounts.incomplete}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                <Clock size={20} className="text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Add Task Button */}
        <div className="text-center mb-6 sm:mb-8">
          <Link
            to="/add-task"
            className="inline-flex items-center px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl sm:rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold text-sm sm:text-base transform hover:scale-105"
          >
            <Plus size={18} className="mr-2" />
            Add New Task
          </Link>
        </div>

        {/* Task Management Section */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-white/20 p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
          <TaskFilter
            currentFilter={currentFilter}
            onFilterChange={setCurrentFilter}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
            taskCounts={taskCounts}
          />
        </div>

        {/* Tasks List */}
        <div className="space-y-3 sm:space-y-4 lg:space-y-6">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-8 sm:py-12 lg:py-16">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <List size={24} className="text-gray-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">No tasks found</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-md mx-auto px-4">
                {searchTerm ? 'Try adjusting your search criteria' : 'Start by adding your first task'}
              </p>
              {!searchTerm && (
                <Link
                  to="/add-task"
                  className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg sm:rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium text-sm sm:text-base"
                >
                  <Plus size={16} className="mr-2" />
                  Add Your First Task
                </Link>
              )}
            </div>
          ) : (
            filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDeleteTask}
                onEdit={handleEditTask}
              />
            ))
          )}
        </div>

        {/* Edit Modal */}
        <TaskEditModal
          task={editingTask}
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          onSave={handleSaveTask}
        />
      </div>
    </div>
  );
};

export default Index;
