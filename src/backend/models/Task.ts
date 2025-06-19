import { v4 as uuidv4 } from 'uuid';
import { TaskState } from '../../util/types';

/**
 * Task class represents a single to-do item with an ID, content, and state.
 * Provides methods to get and set task properties.
 */
export class Task {
  id: string;
  content: string;
  taskState: TaskState;

  /**
   * Creates a new Task instance.
   * @param {string} content - The content/description of the task.
   */
  constructor(content: string) {
    this.id = uuidv4();
    this.content = content;
    this.taskState = TaskState.TODO;
  }

  /**
   * Gets the unique ID of the task.
   * @returns {string} The task ID.
   */
  GetTaskID(): string {
    return this.id;
  }

  /**
   * Gets the content/description of the task.
   * @returns {string} The task content.
   */
  GetTaskContent(): string {
    return this.content;
  }

  /**
   * Sets the state of the task.
   * @param {TaskState} taskState - The new state to set for the task.
   */
  SetTaskState(taskState: TaskState){
    switch (taskState){
      case "TODO":
        this.taskState = TaskState.TODO;
        break;
      case "IN_PROGRESS":
        this.taskState = TaskState.IN_PROGRESS;
        break;
      case "DONE":
        this.taskState = TaskState.DONE;
        break;
      default:
        this.taskState = TaskState.TODO;
    }
  }

}
