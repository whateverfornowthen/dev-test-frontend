import { app } from '../../../main/app';
import * as taskService from '../../../main/services/taskService';

import request from 'supertest';

jest.mock('../../../main/services/taskService');

describe('POST /task/:id/delete', () => {
  test('redirects on success', async () => {
    (taskService.deleteTask as jest.Mock).mockResolvedValue(undefined);
    const res = await request(app).post('/task/1/delete');
    expect(res.status).toBe(302);
    expect(res.headers.location).toMatch(/deleted=true/);
  });
});
