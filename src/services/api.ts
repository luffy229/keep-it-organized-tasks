import { Task } from '@/types/Task';

const API_URL = 'http://localhost:5000/api';

// Helper function to get auth header
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// Get all tasks
export const getTasks = async (): Promise<Task[]> => {
  const response = await fetch(`${API_URL}/todos`, {
    headers: getAuthHeader()
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }
  
  const data = await response.json();
  return data.map((todo: any) => ({
    id: todo._id,
    name: todo.title,
    status: todo.completed ? 'complete' : 'incomplete',
    createdAt: new Date(todo.createdAt),
    userId: todo.user
  }));
};

// Create a new task
export const createTask = async (name: string): Promise<Task> => {
  const response = await fetch(`${API_URL}/todos`, {
    method: 'POST',
    headers: getAuthHeader(),
    body: JSON.stringify({
      title: name,
      completed: false,
      priority: 'medium'
    })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create task');
  }
  
  const todo = await response.json();
  return {
    id: todo._id,
    name: todo.title,
    status: todo.completed ? 'complete' : 'incomplete',
    createdAt: new Date(todo.createdAt),
    userId: todo.user
  };
};

// Update task status
export const updateTaskStatus = async (id: string, status: 'complete' | 'incomplete'): Promise<Task> => {
  const response = await fetch(`${API_URL}/todos/${id}`, {
    method: 'PATCH',
    headers: getAuthHeader(),
    body: JSON.stringify({
      completed: status === 'complete'
    })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update task');
  }
  
  const todo = await response.json();
  return {
    id: todo._id,
    name: todo.title,
    status: todo.completed ? 'complete' : 'incomplete',
    createdAt: new Date(todo.createdAt),
    userId: todo.user
  };
};

// Update task
export const updateTask = async (id: string, name: string, status: 'complete' | 'incomplete'): Promise<Task> => {
  const response = await fetch(`${API_URL}/todos/${id}`, {
    method: 'PATCH',
    headers: getAuthHeader(),
    body: JSON.stringify({
      title: name,
      completed: status === 'complete'
    })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update task');
  }
  
  const todo = await response.json();
  return {
    id: todo._id,
    name: todo.title,
    status: todo.completed ? 'complete' : 'incomplete',
    createdAt: new Date(todo.createdAt),
    userId: todo.user
  };
};

// Delete task
export const deleteTask = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/todos/${id}`, {
    method: 'DELETE',
    headers: getAuthHeader()
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete task');
  }
}; 