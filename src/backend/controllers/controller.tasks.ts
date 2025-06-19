import type {Response } from 'express';
import { Task } from '../models/Task';
import { LocalDB } from '../db/LocalDB';
import type { AuthRequest } from '../auth/auth.middleware';
import { TaskState } from '../../util/types';

/**
 * Task controller functions for handling task CRUD operations for authenticated users.
 * Includes add, retrieve, remove, and update task state.
 */

/**
 * Adds a new task for the authenticated user.
 * @param {AuthRequest} req - Express request object with user email.
 * @param {Response} res - Express response object.
 */
export const addTask = async (req: AuthRequest, res: Response) => {
  
  const email = req.user?.email;
  if (!email) {
    return res.status(401).json({ message: 'Unauthorized - No email found' });
  }
  
  const newTask = new Task(req.body.content);

  const db = LocalDB.getInstance();
  db.addTask(newTask, email);
  
  res.status(201).json({ message: 'task has been added successfully' });
};

/**
 * Retrieves all tasks for the authenticated user.
 * @param {AuthRequest} req - Express request object with user email.
 * @param {Response} res - Express response object.
 */
export const AllTasks = async (req: AuthRequest, res: Response) => {
    const email = req.user?.email;
    if (!email) {
      return res.status(401).json({ message: 'Unauthorized - No email found' });
    }
    
    const db = LocalDB.getInstance();

    const tasks = db.getTasks(email);
  
    res.status(200).json({ 
        tasks: tasks 
    });
};

/**
 * Removes a task by ID for the authenticated user.
 * @param {AuthRequest} req - Express request object with user email.
 * @param {Response} res - Express response object.
 */
export const removeTask = async (req: AuthRequest, res: Response) => {
    const email = req.user?.email;
    if (!email) {
      return res.status(401).json({ message: 'Unauthorized - No email found' });
    }

    const taskId = req.params.id;
    const db = LocalDB.getInstance();
    if (db.removeTaskById(email, taskId)){
      res.status(200).json({ message: 'Task removed successfully' });
    } else{
      res.status(404).json({ message: 'Task not found' });
    }
};

/**
 * Retrieves all tasks for the authenticated user (duplicate of AllTasks, may be for update purposes).
 * @param {AuthRequest} req - Express request object with user email.
 * @param {Response} res - Express response object.
 */
export const UpdateTask = (req: AuthRequest, res: Response) => {
  const email = req.user?.email;
  if (!email) {
    return res.status(401).json({ message: 'Unauthorized - No email found' });
  }
  
  const db = LocalDB.getInstance();

  const tasks = db.getTasks(email);

  res.status(200).json({ 
      tasks: tasks 
  });
};

/**
 * Updates the state of a task for the authenticated user.
 * @param {AuthRequest} req - Express request object with user email.
 * @param {Response} res - Express response object.
 */
export const updateTaskState = (req: AuthRequest, res: Response) => {
  const email = req.user?.email;
  if (!email) {
    return res.status(401).json({ message: 'Unauthorized - No email found' });
  }

  const taskId = req.params.id;
  const { newState } = req.body;

  if (!taskId || !newState) {
    return res.status(400).json({ message: 'Task ID and new state are required' });
  }

  const db = LocalDB.getInstance();
  const success = db.updateTaskState(email, taskId, newState as TaskState);

  if (!success) {
    return res.status(404).json({ message: 'Task not found or update failed' });
  }

  const tasks = db.getTasks(email);
  res.status(200).json({ 
    message: 'Task state updated successfully',
    tasks: tasks 
  });
};