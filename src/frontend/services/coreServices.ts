// coreServices.ts
// Provides API service functions for task management (CRUD) in the frontend.

import { Task } from '../../util/types';

const API_URL = 'http://localhost:3000';

/**
 * taskServices
 * Contains methods for interacting with the backend API for tasks.
 */
export const taskServices = {
    /**
     * Get all tasks for the current user.
     * @returns Promise resolving to an object with a list of tasks.
     */
    getAllTasks: async (): Promise<{ tasks: Task[] }> => {
        const response = await fetch(`${API_URL}/tasks`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch tasks');
        return response.json();
    },

    /**
     * Add a new task for the current user.
     * @param content - The content of the new task
     * @returns Promise resolving to the created Task
     */
    addTask: async (content: string): Promise<Task> => {
        const response = await fetch(`${API_URL}/addTask`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ content })
        });
        if (!response.ok) throw new Error('Failed to add task');
        return response.json();
    },

    /**
     * Remove a task by its ID.
     * @param taskId - The ID of the task to remove
     * @returns Promise resolving to void
     */
    removeTask: async (taskId: string): Promise<void> => {
        const response = await fetch(`${API_URL}/removeTask/${taskId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (!response.ok) throw new Error('Failed to remove task');
        return response.json();
    },

    /**
     * Update the state of a task (e.g., move between columns).
     * @param taskId - The ID of the task to update
     * @param newState - The new state for the task
     * @returns Promise resolving to an object with the updated list of tasks
     */
    updateTaskState: async (taskId: string, newState: string): Promise<{ tasks: Task[] }> => {
        const response = await fetch(`${API_URL}/updateTaskState/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ newState })
        });
        if (!response.ok) throw new Error('Failed to update task state');
        return response.json();
    }
};
