import { app } from '../../../main/app';
import * as taskService from '../../../main/services/taskService';

import request from 'supertest';

jest.mock('../../../main/services/taskService');

describe('POST /add-task', () => {
  const url = '/add-task';

  test('400 local validation when required fields missing', async () => {
    const res = await request(app).post(url).type('form').send({
      title: '', status: '', 'due-day': '', 'due-month': '', 'due-year': ''
    });
    expect(res.status).toBe(400);
    expect(res.text).toContain('There is a problem');
    expect(res.text).toContain('Enter a title');
    expect(res.text).toContain('Select a status');
    expect(res.text).toContain('Enter a valid date');
    expect(taskService.createTask).not.toHaveBeenCalled();
  });

  test('maps API 400 to inline errors', async () => {
    (taskService.createTask as jest.Mock).mockRejectedValue({
      response: { status: 400, data: { errors: [
            { field: 'title', message: 'Enter a title' },
            { field: 'due', message: 'Enter a valid date' },
          ] } }
    });

    const res = await request(app).post(url).type('form').send({
      title: 'X', status: 'PENDING', 'due-day': '31','due-month':'02','due-year':'2025'
    });

    expect(res.status).toBe(400);
    expect(res.text).toContain('There is a problem');
    expect(res.text).toContain('Enter a title');
    expect(res.text).toContain('Enter a valid date');
  });

  test('redirects on success', async () => {
    (taskService.createTask as jest.Mock).mockResolvedValue({ id: '1' });
    const res = await request(app).post(url).type('form').send({
      title: 'Write docs', status: 'PENDING', 'due-day':'10','due-month':'08','due-year':'2025'
    });
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('/?added=true');
  });
});
