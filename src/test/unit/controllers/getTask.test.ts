import { app } from '../../../main/app';
import * as taskService from '../../../main/services/taskService';

import request from 'supertest';

jest.mock('../../../main/services/taskService');

describe('GET /task/:id', () => {
  test('renders task', async () => {
    (taskService.getTask as jest.Mock).mockResolvedValue({ id:'1', title:'A', status:'PENDING', dueDate:'2025-08-10' });
    const res = await request(app).get('/task/1');
    expect(res.status).toBe(200);
    expect(res.text).toContain('A');
  });

  test('404 from API renders 404 page', async () => {
    (taskService.getTask as jest.Mock).mockRejectedValue({ response: { status: 404 } });
    const res = await request(app).get('/task/missing');
    expect(res.status).toBe(404);
  });
});
