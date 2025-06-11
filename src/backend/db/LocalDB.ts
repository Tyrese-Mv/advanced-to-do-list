import type { DB, Task as TaskType } from '../../util/types';

export class LocalDB {
  private static instance: LocalDB;
  private database: DB = {};

  private constructor() {}

  public static getInstance(): LocalDB {
    if (!LocalDB.instance) {
      LocalDB.instance = new LocalDB();
    }
    return LocalDB.instance;
  }

  public addTask(userTask: TaskType, userEmail: string): void {
    if (!this.database[userEmail]) {
      this.database[userEmail] = {
        UserTasks: []
      };
    }
    this.database[userEmail]?.UserTasks?.push(userTask);
  }

  public getTasks(userEmail: string): TaskType[] {
    return this.database[userEmail]?.UserTasks || [];
  }

  // this must return a boolean
  public removeTaskById(userEmail: string, id: string): void {
    if (!this.database[userEmail]) return;
    const userData = this.database[userEmail];
    if (userData?.UserTasks) {
      userData.UserTasks = userData.UserTasks.filter(task => task.id !== id);
    }
  }

  public userLogin(userEmail: string, password: string): boolean{
    if (!this.database[userEmail]) return false;
    if(this.database[userEmail].userCredentials !== password) return false;
    return true;
  }

  public createNewAccount(userEmail: string, password: string): boolean{
    if (this.database[userEmail]) return false;
    this.database[userEmail] = {
      userCredentials: { password }
    };
    return true;
  }

  public toString(): string {
    return JSON.stringify(this.database, null, 2);
  }
}
