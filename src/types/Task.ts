
export interface Task {
  id: string;
  name: string;
  status: 'complete' | 'incomplete';
  createdAt: Date;
}

export type TaskStatus = 'complete' | 'incomplete' | 'all';
