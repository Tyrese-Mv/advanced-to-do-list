// DeleteTaskComponent.tsx
// Renders the delete area for drag-and-drop task deletion in the Kanban board.

import React, { useEffect } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import './DeleteColumn.css';
import { taskServices } from '../services/coreServices'

/**
 * Props for DeleteTaskComponent
 * @property isVisible - Whether the delete area is visible
 * @property taskID - ID of the task to delete (if any)
 * @property setTaskToDelete - Setter to clear the task to delete
 */
interface DeleteTaskComponentProps {
  isVisible: boolean;
  taskID?: string;
  setTaskToDelete: (value: string | undefined) => void;
}

/**
 * Deletes a task by its ID using the task service.
 * @param taskId - ID of the task to delete
 */
const deleteTask = async (taskId: string) => {
  try {
    const response = await taskServices.removeTask(taskId);
    console.log('delete response:', response);
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
  }
}

/**
 * DeleteTaskComponent
 * Renders a droppable area for deleting tasks by drag-and-drop.
 * When a task is dropped, it is deleted and the state is cleared.
 */
export default function DeleteTaskComponent({ isVisible, taskID, setTaskToDelete }: DeleteTaskComponentProps) {
  useEffect(() => {
    if (taskID) {
      deleteTask(taskID);
      setTaskToDelete(undefined);
    }
  }, [taskID, setTaskToDelete]);

  return (
    <Droppable droppableId="delete-column">
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`delete-column ${isVisible ? 'visible' : ''}`}
        >
          <p>🗑️ Drop here to delete</p>
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}