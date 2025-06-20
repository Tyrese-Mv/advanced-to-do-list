/* eslint-disable @typescript-eslint/no-explicit-any */
import { LocalDB } from '../db/LocalDB';
import { TaskState } from '../../util/types';

describe('LocalDB', () => {
  let db: LocalDB;
  const email = 'user@example.com';
  const password = 'pass123';

  beforeEach(() => {
    db = LocalDB.getInstance();
    (db as any).database = {};
  });

  it('should add and retrieve tasks for a user', () => {
    const task = { id: '1', content: 'Test', taskState: TaskState.TODO };
    db.addTask(task, email);
    expect(db.getTasks(email)).toEqual([task]);
  });

  it('should update task state', () => {
    const task = { id: '1', content: 'Test', taskState: TaskState.TODO };
    db.addTask(task, email);
    const result = db.updateTaskState(email, '1', TaskState.DONE);
    expect(result).toBe(true);
    expect(db.getTasks(email)[0].taskState).toBe(TaskState.DONE);
  });

  it('should not update state if user or task not found', () => {
    expect(db.updateTaskState('nouser', '1', TaskState.DONE)).toBe(false);
    db.addTask({ id: '1', content: 'Test', taskState: TaskState.TODO }, email);
    expect(db.updateTaskState(email, '2', TaskState.DONE)).toBe(false);
  });

  it('should remove a task by ID', () => {
    const task = { id: '1', content: 'Test', taskState: TaskState.TODO };
    db.addTask(task, email);
    const result = db.removeTaskById(email, '1');
    expect(result).toBe(true);
    expect(db.getTasks(email)).toEqual([]);
  });

  it('should not remove if user or task not found', () => {
    expect(db.removeTaskById('nouser', '1')).toBe(false);
    db.addTask({ id: '1', content: 'Test', taskState: TaskState.TODO }, email);
    expect(db.removeTaskById(email, '2')).toBe(false);
  });

  it('should create new account and prevent duplicate', () => {
    expect(db.createNewAccount(email, password)).toBe(true);
    expect(db.createNewAccount(email, password)).toBe(false);
  });

  it('should authenticate user with correct credentials', () => {
    db.createNewAccount(email, password);
    (db as any).database[email].userCredentials = password;
    expect(db.userLogin(email, password)).toBe(true);
    expect(db.userLogin(email, 'wrong')).toBe(false);
    expect(db.userLogin('nouser', password)).toBe(false);
  });

  it('should stringify the database', () => {
    db.createNewAccount(email, password);
    expect(typeof db.toString()).toBe('string');
  });
}); 