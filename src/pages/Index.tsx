
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import Layout from '@/components/Layout';
import TaskCard from '@/components/TaskCard';
import TaskFilter from '@/components/TaskFilter';
import { Task, TaskStatus } from '@/types/Task';
import { loadTasks, updateTaskStatus, deleteTask } from '@/utils/taskStorage';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskStatus>('all');
  const { toast } = useToast();

  useEffect(() => {
    setTasks(loadTasks());
  }, []);

  const handleToggleStatus = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const newStatus = task.status === 'complete' ? 'incomplete' : 'complete';
    updateTaskStatus(id, newStatus);
    setTasks(loadTasks());

    toast({
      title: newStatus === 'complete' ? 'Task completed!' : 'Task marked incomplete',
      description: `"${task.name}" has been updated.`,
    });
  };

  const handleDelete = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    deleteTask(id);
    setTasks(loadTasks());

    toast({
      title: 'Task deleted',
      description: `"${task.name}" has been removed.`,
      variant: 'destructive',
    });
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
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
            <p className="text-gray-600 mt-1">Manage your daily tasks efficiently</p>
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
          taskCounts={taskCounts}
        />

        {filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'all' ? 'No tasks yet' : `No ${filter} tasks`}
            </h3>
            <p className="text-gray-500 mb-4">
              {filter === 'all' 
                ? "Get started by adding your first task!"
                : `You don't have any ${filter} tasks right now.`
              }
            </p>
            {filter === 'all' && (
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
            {filteredTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Index;
