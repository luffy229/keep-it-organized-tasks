import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Sparkles } from 'lucide-react';
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading tasks...</p>
            </div>
          ) : filteredAndSortedTasks.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-purple-50 bg-opacity-50 rounded-lg p-8">
              <p className="text-gray-600 text-lg">No tasks found. Create your first task!</p>
            </div>
          ) : (
            filteredAndSortedTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingTask && (
        <TaskEditModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSave={handleSaveEdit}
        />
      )}
    </Layout>
  );
};

export default Index;
