export type Status = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: Status;
  dueDate: string;
}

export type TaskCreate = {
  title: string;
  description?: string;
  status: Status;
  dueDate: string;
};

export type TaskUpdate = TaskCreate;
