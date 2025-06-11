import { Task } from '../../util/types';

const API_URL = 'http://localhost:3000';

export const taskServices = {
    // Get all tasks for the current user
    getAllTasks: async (): Promise<Task[]> => {
        const response = await fetch(`${API_URL}/tasks`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch tasks');
        return response.json();
    },

    // Add a new task
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

    // Remove a task
    removeTask: async (taskId: string): Promise<void> => {
        const response = await fetch(`${API_URL}/removeTask/${taskId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (!response.ok) throw new Error('Failed to remove task');
    }
};
