import * as taskController from '../controllers/taskController';

import { Application } from 'express';

export default function (app: Application): void {

  app.get('/', taskController.taskList);
  app.get('/task/:id', taskController.getTask);
  app.post('/task/:id/delete', taskController.deleteTask);
  app.post('/task/update/:id', taskController.updateTask);
  app.get('/add-task', taskController.addForm);
  app.post('/add-task', taskController.createTask);
  app.get('/task/update/:id', taskController.updateForm);

}
