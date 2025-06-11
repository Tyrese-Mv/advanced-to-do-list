import type {Response } from 'express';
import { Task } from '../models/Task';
import { LocalDB } from '../db/LocalDB';
import type { AuthRequest } from '../auth/auth.middleware';

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

export const removeTask = async (req: AuthRequest, res: Response) => {
    const email = req.user?.email;
    if (!email) {
      return res.status(401).json({ message: 'Unauthorized - No email found' });
    }

    const taskId = req.params.id;
    const db = LocalDB.getInstance();
    db.removeTaskById(email, taskId);
    res.status(200).json({ message: 'Task removed successfully' });
};