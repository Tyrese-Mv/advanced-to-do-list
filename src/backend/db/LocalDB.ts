import type { DB, Task as TaskType } from '../../util/types';
import { TaskState } from '../../util/types';

/**
 * LocalDB is a singleton class that simulates a local in-memory database for user tasks and credentials.
 * It provides methods to add, retrieve, update, and remove tasks, as well as user authentication and account creation.
 */
export class LocalDB {
  private static instance: LocalDB;
  private database: DB = {};

  private constructor() {}

  /**
   * Returns the singleton instance of LocalDB.
   * @returns {LocalDB} The singleton instance.
   */
  public static getInstance(): LocalDB {
    if (!LocalDB.instance) {
      LocalDB.instance = new LocalDB();
    }
    return LocalDB.instance;
  }

  /**
   * Adds a task for a specific user.
   * @param {TaskType} userTask - The task to add.
   * @param {string} userEmail - The user's email address.
   */
  public addTask(userTask: TaskType, userEmail: string): void {
    if (!this.database[userEmail]) {
      this.database[userEmail] = {
        UserTasks: []
      };
    }
    this.database[userEmail]?.UserTasks?.push(userTask);

  }

  /**
   * Retrieves all tasks for a specific user.
   * @param {string} userEmail - The user's email address.
   * @returns {TaskType[]} Array of tasks for the user.
   */
  public getTasks(userEmail: string): TaskType[] {
    return this.database[userEmail]?.UserTasks || [];
  }

  /**
   * Updates the state of a specific task for a user.
   * @param {string} userEmail - The user's email address.
   * @param {string} taskID - The ID of the task to update.
   * @param {TaskState} newState - The new state to set for the task.
   * @returns {boolean} True if the update was successful, false otherwise.
   */
  public updateTaskState(userEmail: string, taskID: string, newState: TaskState): boolean {
    if (!this.database[userEmail]) return false;

    const userData = this.database[userEmail];
    if (!userData?.UserTasks) return false;

    const taskIndex = userData.UserTasks.findIndex(task => task.id === taskID);
    if (taskIndex === -1) return false;

    userData.UserTasks[taskIndex].taskState = newState;
    return true;
  }

  /**
   * Removes a task by its ID for a specific user.
   * @param {string} userEmail - The user's email address.
   * @param {string} id - The ID of the task to remove.
   * @returns {boolean} True if the task was removed, false otherwise.
   */
  public removeTaskById(userEmail: string, id: string): boolean {
    console.log("task to be deleted:", id);
    console.log('database before:', this.toString());
    if (!this.database[userEmail]) return false;
    const userData = this.database[userEmail];
    if (userData?.UserTasks) {
      const initialLength = userData.UserTasks.length;
      userData.UserTasks = userData.UserTasks.filter(task => task.id !== id);
      console.log('database after:', this.toString());
      return userData.UserTasks.length < initialLength;
    }
    return false;
  }

  /**
   * Authenticates a user by email and password.
   * @param {string} userEmail - The user's email address.
   * @param {string} password - The user's password.
   * @returns {boolean} True if authentication is successful, false otherwise.
   */
  public userLogin(userEmail: string, password: string): boolean{
    if (!this.database[userEmail]) return false;
    if(this.database[userEmail].userCredentials !== password) return false;
    return true;
  }

  /**
   * Creates a new user account with the given email and password.
   * @param {string} userEmail - The user's email address.
   * @param {string} password - The user's password.
   * @returns {boolean} True if the account was created, false if the user already exists.
   */
  public createNewAccount(userEmail: string, password: string): boolean{
    if (this.database[userEmail]) return false;
    this.database[userEmail] = {
      userCredentials: { password }
    };
    return true;
  }

  /**
   * Returns a string representation of the database.
   * @returns {string} The database as a JSON string.
   */
  public toString(): string {
    return JSON.stringify(this.database, null, 2);
  }
}
