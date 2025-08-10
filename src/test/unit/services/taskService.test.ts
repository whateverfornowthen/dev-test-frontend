import * as taskService from '../../../main/services/taskService';
import type { Task, TaskCreate, TaskUpdate } from '../../../main/types/task';

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

jest.mock('axios', () => {
  const actual = jest.requireActual('axios');
  (actual as any).create = () => actual;
  return actual;
});

const mock = new MockAdapter(axios as any);

beforeEach(() => mock.reset());

describe('taskService', () => {

  test('listTasks GETs /v1/tasks', async () => {
    const apiResult: Task[] = [{ id: 1, title: 'A', status: 'PENDING', dueDate: '2025-08-10' }];
    mock.onGet('/v1/tasks').reply(200, apiResult);

    const res = await taskService.listTasks();
    expect(res).toEqual(apiResult);
  });

  test('getTask GETs /v1/tasks/:id', async () => {
    const apiResult: Task = { id: 123, title: 'Doc', status: 'PENDING', dueDate: '2025-08-10' };
    mock.onGet('/v1/tasks/123').reply(200, apiResult);

    const res = await taskService.getTask('123');
    expect(res.id).toBe(123);
    expect(res.title).toBe('Doc');
  });

  test('createTask POSTs payload', async () => {
    const payload: TaskCreate = {
      title: 'New',
      status: 'PENDING',
      dueDate: '2025-08-10',
    };
    const apiResult: Task = { id: 9, ...payload };

    mock.onPost('/v1/tasks', payload).reply(201, apiResult);

    const res = await taskService.createTask(payload);
    expect(res).toEqual(apiResult);
  });

  test('updateTask PUTs payload', async () => {
    const payload: TaskUpdate = {
      title: 'Updated',
      status: 'IN_PROGRESS',
      dueDate: '2025-08-11',
    };
    const apiResult: Task = { id: 9, ...payload };

    mock.onPut('/v1/tasks/9', payload).reply(200, apiResult);

    const res = await taskService.updateTask('9', payload);
    expect(res).toEqual(apiResult);
    expect(res.status).toBe('IN_PROGRESS');
  });

  test('deleteTask DELETEs /v1/tasks/:id', async () => {
    mock.onDelete('/v1/tasks/9').reply(204);
    await expect(taskService.deleteTask('9')).resolves.toBeUndefined();
  });

  test('propagates 404 errors (e.g., getTask)', async () => {
    mock.onGet('/v1/tasks/missing').reply(404, { message: 'Not found' });
    await expect(taskService.getTask('missing')).rejects.toMatchObject({ response: { status: 404 } });
  });

  test('propagates 400 errors (e.g., createTask validation)', async () => {
    const bad: TaskCreate = { title: '', status: 'PENDING', dueDate: '' };
    mock.onPost('/v1/tasks', bad).reply(400, {
      message: 'Validation failed',
      errors: [{ field: 'title', message: 'Enter a title' }],
    });
    await expect(taskService.createTask(bad)).rejects.toMatchObject({ response: { status: 400 } });
  });
});
