/* eslint-disable @typescript-eslint/no-explicit-any */
import { addTask, AllTasks, removeTask, UpdateTask, updateTaskState } from '../controllers/controller.tasks';
import { LocalDB } from '../db/LocalDB';
import { Task } from '../models/Task';
import { TaskState } from '../../util/types';
import type { Response } from 'express';
import type { AuthRequest } from '../auth/auth.middleware';

// Mocks
const mockRes = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};



describe('Task Controller', () => {
  let db: LocalDB;
  let email: string;
  let req: Partial<AuthRequest>;
  let res: Partial<Response>;

  beforeEach(() => {
    db = LocalDB.getInstance();
    // Reset the DB for each test
    ((db as unknown) as { database: any }).database = {};
    email = 'test@example.com';
    req = { user: { email }, body: {}, params: {} };
    res = mockRes();
  });

  describe('addTask', () => {
    it('should add a task for authenticated user', async () => {
      req.body.content = 'Test Task';
      await addTask(req as AuthRequest, res as Response);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'task has been added successfully' });
      expect(db.getTasks(email).length).toBe(1);
    });
    it('should return 401 if no email', async () => {
      req.user = undefined;
      await addTask(req as AuthRequest, res as Response);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized - No email found' });
    });
  });

  describe('AllTasks', () => {
    it('should return all tasks for authenticated user', async () => {
      db.addTask(new Task('Task 1'), email);
      await AllTasks(req as AuthRequest, res as Response);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ tasks: db.getTasks(email) });
    });
    it('should return 401 if no email', async () => {
      req.user = undefined;
      await AllTasks(req as AuthRequest, res as Response);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized - No email found' });
    });
  });

  describe('removeTask', () => {
    it('should remove a task by ID', async () => {
      const task = new Task('Task to remove');
      db.addTask(task, email);
      req.params = req.params || {};
      req.params.id = task.id;
      await removeTask(req as AuthRequest, res as Response);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Task removed successfully' });
      expect(db.getTasks(email).length).toBe(0);
    });
    it('should return 404 if task not found', async () => {
      req.params = req.params || {};
      req.params.id = 'nonexistent';
      await removeTask(req as AuthRequest, res as Response);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Task not found' });
    });
    it('should return 401 if no email', async () => {
      req.user = undefined;
      await removeTask(req as AuthRequest, res as Response);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized - No email found' });
    });
  });

  describe('UpdateTask', () => {
    it('should return all tasks for authenticated user', () => {
      db.addTask(new Task('Task 1'), email);
      UpdateTask(req as AuthRequest, res as Response);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ tasks: db.getTasks(email) });
    });
    it('should return 401 if no email', () => {
      req.user = undefined;
      UpdateTask(req as AuthRequest, res as Response);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized - No email found' });
    });
  });

  describe('updateTaskState', () => {
    it('should update the state of a task', () => {
      const task = new Task('Task to update');
      db.addTask(task, email);
      req.params = req.params || {};
      req.params.id = task.id;
      req.body.newState = TaskState.DONE;
      updateTaskState(req as AuthRequest, res as Response);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Task state updated successfully',
        tasks: db.getTasks(email)
      });
      expect(db.getTasks(email)[0].taskState).toBe(TaskState.DONE);
    });
    it('should return 400 if taskId or newState missing', () => {
      updateTaskState(req as AuthRequest, res as Response);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Task ID and new state are required' });
    });
    it('should return 404 if task not found', () => {
      req.params = req.params || {};
      req.params.id = 'nonexistent';
      req.body.newState = TaskState.DONE;
      updateTaskState(req as AuthRequest, res as Response);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Task not found or update failed' });
    });
    it('should return 401 if no email', () => {
      req.user = undefined;
      updateTaskState(req as AuthRequest, res as Response);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized - No email found' });
    });
  });
}); 