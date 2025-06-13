
import { Task } from '@/types/Task';

const STORAGE_KEY = 'todo-tasks';

export const saveTasks = (tasks: Task[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

export const loadTasks = (): Task[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  
  try {
    const parsed = JSON.parse(stored);
    return parsed.map((task: any) => ({
      ...task,
      createdAt: new Date(task.createdAt)
    }));
  } catch {
    return [];
  }
};

export const addTask = (name: string): Task => {
  const tasks = loadTasks();
  const newTask: Task = {
    id: crypto.randomUUID(),
    name: name.trim(),
    status: 'incomplete',
    createdAt: new Date()
  };
  
  const updatedTasks = [newTask, ...tasks];
  saveTasks(updatedTasks);
  return newTask;
};

export const updateTaskStatus = (id: string, status: 'complete' | 'incomplete'): void => {
  const tasks = loadTasks();
  const updatedTasks = tasks.map(task => 
    task.id === id ? { ...task, status } : task
  );
  saveTasks(updatedTasks);
};

export const deleteTask = (id: string): void => {
  const tasks = loadTasks();
  const updatedTasks = tasks.filter(task => task.id !== id);
  saveTasks(updatedTasks);
};
