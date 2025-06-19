// types.ts
// Shared type definitions for backend and frontend.

// Backend types

/**
 * Database structure mapping user emails to their credentials and tasks.
 */
export interface DB {
    [userEmail: string]: {userCredentials?: credentials, UserTasks?: Task[]};
  }
  
/**
 * Task object structure.
 */
export interface Task {
    id: string;
    content: string;
    taskState: TaskState;
}

/**
 * User credentials structure.
 */
export interface credentials{
    password?: string
}

/**
 * Enum for possible task states.
 */
export enum TaskState{
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE"
}

// Frontend types
  
/**
 * Column structure for the Kanban board.
 */
export interface Column {
    id: string;
    title: string;
    taskIds?: string[];
}
  
/**
 * Board data structure for the Kanban board.
 */
export interface BoardData {
    tasks: {
      [key: string]: Task;
    };
    columns: {
      [key: string]: Column;
    };
    columnOrder: string[];
} 