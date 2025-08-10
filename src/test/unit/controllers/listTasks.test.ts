import { app } from '../../../main/app';
import * as taskService from '../../../main/services/taskService';

import request from 'supertest';

jest.mock('../../../main/services/taskService');

describe('GET /', () => {
  test('renders list of tasks', async () => {
    (taskService.listTasks as jest.Mock).mockResolvedValue([
      { id:'1', title:'Alpha', status:'PENDING', dueDate:'2025-08-10' }
    ]);
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toContain('Alpha');
  });

  test('renders empty state when no tasks', async () => {
    (taskService.listTasks as jest.Mock).mockResolvedValue([]);
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toMatch(/No tasks|Add Task/i);
  });
});
