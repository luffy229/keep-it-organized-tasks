
import { Task } from '@/types/Task';

const STORAGE_KEY = 'todo-tasks';

// Dummy tasks for different users
const DUMMY_TASKS: Task[] = [
  {
    id: '1',
    name: 'Complete project documentation',
    status: 'incomplete',
    createdAt: new Date('2024-01-15'),
    userId: '1'
  },
  {
    id: '2',
    name: 'Review code changes',
    status: 'complete',
    createdAt: new Date('2024-01-16'),
    userId: '1'
  },
  {
    id: '3',
    name: 'Update website design',
    status: 'incomplete',
    createdAt: new Date('2024-01-17'),
    userId: '1'
  },
  {
    id: '4',
    name: 'Prepare presentation',
    status: 'incomplete',
    createdAt: new Date('2024-01-18'),
    userId: '2'
  },
  {
    id: '5',
    name: 'Send follow-up emails',
    status: 'complete',
    createdAt: new Date('2024-01-19'),
    userId: '2'
  }
];

export const saveTasks = (tasks: Task[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

export const loadTasks = (userId?: string): Task[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  let tasks: Task[] = [];
  
  if (!stored) {
    // Initialize with dummy data
    tasks = DUMMY_TASKS;
    saveTasks(tasks);
  } else {
    try {
      const parsed = JSON.parse(stored);
      tasks = parsed.map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt)
      }));
    } catch {
      tasks = DUMMY_TASKS;
      saveTasks(tasks);
    }
  }
  
  // Filter by user if userId provided
  if (userId) {
    return tasks.filter(task => task.userId === userId);
  }
  
  return tasks;
};

export const addTask = (name: string, userId: string): Task => {
  const tasks = loadTasks();
  const newTask: Task = {
    id: crypto.randomUUID(),
    name: name.trim(),
    status: 'incomplete',
    createdAt: new Date(),
    userId
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

export const updateTask = (id: string, name: string, status: 'complete' | 'incomplete'): void => {
  const tasks = loadTasks();
  const updatedTasks = tasks.map(task => 
    task.id === id ? { ...task, name, status } : task
  );
  saveTasks(updatedTasks);
};

export const deleteTask = (id: string): void => {
  const tasks = loadTasks();
  const updatedTasks = tasks.filter(task => task.id !== id);
  saveTasks(updatedTasks);
};
