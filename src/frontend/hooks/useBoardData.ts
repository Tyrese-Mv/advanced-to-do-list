import { useState, useCallback } from 'react';
import type { BoardData } from '../../util/types';
import { taskServices } from '../services/coreServices';

const initialData: BoardData = {
  tasks: {},
  columns: {
    'TODO': { id: 'TODO', title: 'To Do', taskIds: [] },
    'IN_PROGRESS': { id: 'IN_PROGRESS', title: 'In Progress', taskIds: [] },
    'DONE': { id: 'DONE', title: 'Done', taskIds: [] },
    'delete-column': { id: 'delete-column', title: 'Delete', taskIds: [] },
  },
  columnOrder: ['TODO', 'IN_PROGRESS', 'DONE', 'delete-column'],
};

/**
 * useBoardData
 * Custom hook to manage the board's state and fetch tasks from the backend.
 * @returns { data, setData, fetchTasks } - Board state, setter, and fetch function
 */
export function useBoardData() {
  const [data, setData] = useState<BoardData>(initialData);

  const fetchTasks = useCallback(async () => {
    try {
      const response = await taskServices.getAllTasks();
      const taskList = response.tasks;
      setData(prev => ({
        ...prev,
        tasks: taskList.reduce((acc, task) => ({ ...acc, [task.id]: task }), {}),
        columns: {
          ...prev.columns,
          'TODO': {
            ...prev.columns['TODO'],
            taskIds: taskList.filter(task => task.taskState === 'TODO').map(task => task.id)
          },
          'IN_PROGRESS': {
            ...prev.columns['IN_PROGRESS'],
            taskIds: taskList.filter(task => task.taskState === 'IN_PROGRESS').map(task => task.id)
          },
          'DONE': {
            ...prev.columns['DONE'],
            taskIds: taskList.filter(task => task.taskState === 'DONE').map(task => task.id)
          }
        }
      }));
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  }, []);

  return { data, setData, fetchTasks };
} 