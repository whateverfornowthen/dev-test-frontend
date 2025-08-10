import type { Task, TaskCreate, TaskUpdate } from '../types/task';

import axios from 'axios';

const api = axios.create({
  baseURL: process.env.TASKS_API_BASE_URL ?? 'http://localhost:4000',
  timeout: 10_000,
});

export async function listTasks(): Promise<Task[]> {
  const { data } = await api.get<Task[]>('/v1/tasks');
  return data;
}

export async function getTask(id: string): Promise<Task> {
  const { data } = await api.get<Task>(`/v1/tasks/${id}`);
  return data;
}

export async function createTask(payload: TaskCreate): Promise<Task> {
  const { data } = await api.post<Task>('/v1/tasks', payload);
  return data;
}

export async function updateTask(id: string, payload: TaskUpdate): Promise<Task> {
  const { data } = await api.put<Task>(`/v1/tasks/${id}`, payload);
  return data;
}

export async function deleteTask(id: string): Promise<void> {
  await api.delete(`/v1/tasks/${id}`);
}
