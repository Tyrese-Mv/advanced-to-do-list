import { v4 as uuidv4 } from 'uuid';

export class Task {
  id: string;
  content: string;

  constructor(content: string) {
    this.id = uuidv4();
    this.content = content;
  }

  GetTaskID(): string {
    return this.id;
  }

  GetTaskContent(): string {
    return this.content;
  }

}
