
export interface Task {
  id: string;
  name: string;
  status: 'complete' | 'incomplete';
  createdAt: Date;
  userId: string;
}

export type TaskStatus = 'complete' | 'incomplete' | 'all';

export type SortBy = 'name' | 'status' | 'createdAt';
export type SortOrder = 'asc' | 'desc';

export interface User {
  id: string;
  email: string;
  name: string;
}
