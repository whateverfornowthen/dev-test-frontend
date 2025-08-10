import { app } from '../../../main/app';
import * as taskService from '../../../main/services/taskService';

import request from 'supertest';

jest.mock('../../../main/services/taskService');

describe('POST /task/update/:id', () => {
  const url = '/task/update/123';

  test('400 local validation when required fields missing', async () => {
    const res = await request(app).post(url).type('form').send({
      title: '', status: '', 'due-day': '', 'due-month': '', 'due-year': ''
    });
    expect(res.status).toBe(400);
    expect(res.text).toContain('There is a problem');
    expect(res.text).toContain('Enter a title');
    expect(res.text).toContain('Select a status');
    expect(res.text).toContain('Enter a valid date');
    expect(taskService.updateTask).not.toHaveBeenCalled();
  });

  test('maps API 400 to inline errors', async () => {
    (taskService.updateTask as jest.Mock).mockRejectedValue({
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

  test('404 from API renders 404', async () => {
    (taskService.updateTask as jest.Mock).mockRejectedValue({ response: { status: 404 } });
    const res = await request(app).post(url).type('form').send({
      title:'A', status:'PENDING', 'due-day':'10','due-month':'08','due-year':'2025'
    });
    expect(res.status).toBe(404);
    expect(res.text).toMatch(/Not Found/);
  });

  test('redirects on success', async () => {
    (taskService.updateTask as jest.Mock).mockResolvedValue({ id:'123', title:'A', status:'PENDING', dueDate:'2025-08-10' });
    const res = await request(app).post(url).type('form').send({
      title: 'A', status: 'PENDING', 'due-day':'10','due-month':'08','due-year':'2025'
    });
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('/?updated=true');
  });
});
