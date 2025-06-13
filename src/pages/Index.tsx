
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
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
      title: newStatus === 'complete' ? 'Task completed!' : 'Task marked incomplete',
      description: `"${task.name}" has been updated.`,
    });
  };

  const handleDelete = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    deleteTask(id);
    setTasks(loadTasks(user?.id));

    toast({
      title: 'Task deleted',
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
      title: 'Task updated!',
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

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Tasks</h1>
            <p className="text-gray-600 mt-1">
              Welcome back, {user?.name}! Manage your daily tasks efficiently
            </p>
          </div>
          
          <Link
            to="/add-task"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Add New Task
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
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No matching tasks found' : 
               filter === 'all' ? 'No tasks yet' : `No ${filter} tasks`}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? `No tasks match "${searchTerm}". Try a different search term.` :
               filter === 'all' 
                ? "Get started by adding your first task!"
                : `You don't have any ${filter} tasks right now.`
              }
            </p>
            {!searchTerm && filter === 'all' && (
              <Link
                to="/add-task"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} className="mr-2" />
                Add Your First Task
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
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
