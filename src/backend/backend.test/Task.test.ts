import { Task } from '../models/Task';
import { TaskState } from '../../util/types';

describe('Task Model', () => {
  it('should create a task with correct content and default state', () => {
    const task = new Task('Test content');
    expect(task.content).toBe('Test content');
    expect(task.taskState).toBe(TaskState.TODO);
    expect(typeof task.id).toBe('string');
  });

  it('should return the correct task ID', () => {
    const task = new Task('Test');
    expect(task.GetTaskID()).toBe(task.id);
  });

  it('should return the correct task content', () => {
    const task = new Task('Test content');
    expect(task.GetTaskContent()).toBe('Test content');
  });

  it('should set the task state correctly', () => {
    const task = new Task('Test');
    task.SetTaskState(TaskState.DONE);
    expect(task.taskState).toBe(TaskState.DONE);
    task.SetTaskState(TaskState.IN_PROGRESS);
    expect(task.taskState).toBe(TaskState.IN_PROGRESS);
    task.SetTaskState('INVALID' as TaskState);
    expect(task.taskState).toBe(TaskState.TODO);
  });
}); 