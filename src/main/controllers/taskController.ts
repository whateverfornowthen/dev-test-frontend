import { buildIsoDateFromParts, splitIsoDate } from '../helpers/dateHelper';
import { extractFieldErrors } from '../helpers/fieldErrorsHelper';
import * as taskService from '../services/taskService';
import type { Status, TaskCreate, TaskUpdate } from '../types/task';

import type { NextFunction, Request, Response } from 'express';

export async function taskList(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const tasks = await taskService.listTasks();
    res.render('list', { tasks, query: req.query });
  } catch (err) {
    next(err);
  }
}

export async function getTask(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const task = await taskService.getTask(req.params.id);
    res.render('task', { task });
  } catch (err) {
    if (err?.response?.status === 404) {return res.status(404).render('not-found');}
    return next(err);
  }
}

export async function deleteTask(req: Request, res: Response): Promise<void> {
  await taskService.deleteTask(req.params.id);
  res.redirect('/?deleted=true');
}

export async function updateForm(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const task = await taskService.getTask(req.params.id);
    const dueDateParts = splitIsoDate(task.dueDate);
    res.render('update-task', { task, dueDateParts });
  } catch (err) {
    if (err?.response?.status === 404) {return res.status(404).render('not-found');}
    return next(err);
  }
}

export async function updateTask(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const dueDateInput = buildIsoDateFromParts(
      req.body['due-day'],
      req.body['due-month'],
      req.body['due-year']
    );

    const title = req.body.title?.trim();
    const description = req.body.description?.trim();
    const rawStatus = req.body.status as string | undefined;

    const status = ['PENDING', 'IN_PROGRESS', 'COMPLETED'].includes(rawStatus as Status)
      ? rawStatus as Status
      : undefined;

    const localErrors: Record<string, string> = {};
    if (!title) {localErrors.title = 'Enter a title';}
    if (!status) {localErrors.status = 'Select a status';}
    if (!dueDateInput) {localErrors.due = 'Enter a valid date';}

    if (Object.keys(localErrors).length) {
      return res.status(400).render('update-task', {
        task: { id: req.params.id, ...req.body },
        errors: localErrors,
        values: req.body,
        dueDateParts: {
          day: req.body['due-day'],
          month: req.body['due-month'],
          year: req.body['due-year'],
        },
      });
    }

    const dueDate = dueDateInput as string;
    const statusVal = status as Status;

    const updatePayload: TaskUpdate = {
      title,
      status: statusVal,
      dueDate,
      ...(description ? { description } : {}),
    };

    await taskService.updateTask(req.params.id, updatePayload);
    res.redirect('/?updated=true');
  } catch (err) {
    const fieldErrors = extractFieldErrors(err);
    if (fieldErrors) {
      return res.status(400).render('update-task', {
        task: { id: req.params.id, ...req.body },
        errors: fieldErrors,
        values: req.body,
        dueDateParts: {
          day: req.body['due-day'],
          month: req.body['due-month'],
          year: req.body['due-year'],
        },
      });
    }
    if (err?.response?.status === 404) {return res.status(404).render('not-found');}
    return next(err);
  }
}

export async function addForm(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.render('add-task');
  } catch (err) {
    next(err);
  }
}

export async function createTask(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const dueDateInput = buildIsoDateFromParts(
      req.body['due-day'],
      req.body['due-month'],
      req.body['due-year']
    );

    const title = req.body.title?.trim();
    const description = req.body.description?.trim();
    const rawStatus = req.body.status as string | undefined;

    const status = ['PENDING', 'IN_PROGRESS', 'COMPLETED'].includes(rawStatus as Status)
      ? rawStatus as Status
      : undefined;

    const localErrors: Record<string, string> = {};
    if (!title) {localErrors.title = 'Enter a title';}
    if (!status) {localErrors.status = 'Select a status';}
    if (!dueDateInput) {localErrors.due = 'Enter a valid date';}

    if (Object.keys(localErrors).length) {
      return res.status(400).render('add-task', {
        errors: localErrors,
        values: req.body,
        dueDateParts: {
          day: req.body['due-day'],
          month: req.body['due-month'],
          year: req.body['due-year'],
        },
      });
    }

    const dueDate = dueDateInput as string;
    const statusVal = status as Status;

    const payload: TaskCreate = {
      title,
      status: statusVal,
      dueDate,
      ...(description ? { description } : {}),
    };

    await taskService.createTask(payload);
    res.redirect('/?added=true');
  } catch (err) {
    const fieldErrors = extractFieldErrors(err);
    if (fieldErrors) {
      return res.status(400).render('add-task', {
        errors: fieldErrors,
        values: req.body,
        dueDateParts: {
          day: req.body['due-day'],
          month: req.body['due-month'],
          year: req.body['due-year'],
        },
      });
    }
    return next(err);
  }
}
