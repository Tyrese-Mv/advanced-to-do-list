// Backend

export interface DB {
    [userEmail: string]: {userCredentials?: credentials, UserTasks?: Task[]};
  }
  
export interface Task {
    id: string;
    content: string;
}

export interface credentials{
    password?: string
}

// Frontend
  
export interface Column {
    id: string;
    title: string;
    taskIds?: string[];
}
  
export interface BoardData {
    tasks: {
      [key: string]: Task;
    };
    columns: {
      [key: string]: Column;
    };
    columnOrder: string[];
} 