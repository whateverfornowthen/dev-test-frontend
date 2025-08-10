import * as taskController from '../../main/controllers/taskController';
import mountRoutes from '../../main/routes/home';

import express, { Application } from 'express';
import request from 'supertest';

jest.mock('../../main/controllers/taskController', () => {
  const respond = (name: string) =>
    jest.fn((req: any, res: any) => res.set('handler', name).status(204).end());
  return {
    taskList: respond('taskList'),
    getTask: respond('getTask'),
    deleteTask: respond('deleteTask'),
    updateTask: respond('updateTask'),
    addForm: respond('addForm'),
    createTask: respond('createTask'),
    updateForm: respond('updateForm'),
  };
});

function makeApp(): Application {
  const app = express();
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  mountRoutes(app);

  app.use((req, res) => res.status(404).end());
  return app;
}

describe('App routes -> controller wiring', () => {
  let app: Application;
  beforeEach(() => {
    app = makeApp();
    jest.clearAllMocks();
  });

  test('GET / -> taskList', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(204);
    expect(res.headers['handler']).toBe('taskList');
  });

  test('GET /task/:id -> getTask (passes id)', async () => {
    const res = await request(app).get('/task/123');
    expect(res.status).toBe(204);
    expect(res.headers['handler']).toBe('getTask');
    expect((taskController.getTask as jest.Mock).mock.calls[0][0].params.id).toBe('123');
  });

  test('POST /task/:id/delete -> deleteTask', async () => {
    const res = await request(app).post('/task/abc-xyz/delete');
    expect(res.status).toBe(204);
    expect(res.headers['handler']).toBe('deleteTask');
    expect((taskController.deleteTask as jest.Mock).mock.calls[0][0].params.id).toBe('abc-xyz');
  });

  test('POST /task/update/:id -> updateTask', async () => {
    const res = await request(app)
      .post('/task/update/42')
      .type('form')
      .send({ title: 'T', status: 'PENDING', 'due-day': '10', 'due-month': '08', 'due-year': '2025' });
    expect(res.status).toBe(204);
    expect(res.headers['handler']).toBe('updateTask');
    expect((taskController.updateTask as jest.Mock).mock.calls[0][0].params.id).toBe('42');
  });

  test('GET /add-task -> addForm', async () => {
    const res = await request(app).get('/add-task');
    expect(res.status).toBe(204);
    expect(res.headers['handler']).toBe('addForm');
  });

  test('POST /add-task -> createTask', async () => {
    const res = await request(app)
      .post('/add-task')
      .type('form')
      .send({ title: 'A', status: 'PENDING', 'due-day': '10', 'due-month': '08', 'due-year': '2025' });
    expect(res.status).toBe(204);
    expect(res.headers['handler']).toBe('createTask');
  });

  test('GET /task/update/:id -> updateForm', async () => {
    const res = await request(app).get('/task/update/7');
    expect(res.status).toBe(204);
    expect(res.headers['handler']).toBe('updateForm');
    expect((taskController.updateForm as jest.Mock).mock.calls[0][0].params.id).toBe('7');
  });

  test('Method mismatch gets 404 (e.g., GET /task/:id/delete)', async () => {
    const res = await request(app).get('/task/1/delete');
    expect(res.status).toBe(404);
    expect((taskController.deleteTask as jest.Mock).mock.calls).toHaveLength(0);
  });
});
