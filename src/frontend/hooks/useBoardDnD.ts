import { useState } from 'react';
import type { DropResult } from '@hello-pangea/dnd';
import { taskServices } from '../services/coreServices';
import type { BoardData } from '../../util/types';

/**
 * useBoardDnD
 * Custom hook to manage drag-and-drop logic and delete state for the board.
 * @param data - Board data state
 * @param setData - Setter for board data
 * @param fetchTasks - Function to fetch tasks from backend
 * @returns Drag-and-drop handlers and delete state
 */
export function useBoardDnD(
  data: BoardData,
  setData: React.Dispatch<React.SetStateAction<BoardData>>,
  fetchTasks: () => Promise<void>
) {
  // State for showing the delete column and tracking the task to delete
  const [showDeleteColumn, setShowDeleteColumn] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | undefined>();

  /**
   * Handler for when drag starts. Shows the delete column.
   */
  const onBeforeDragStart = () => {
    setShowDeleteColumn(true);
  };

  /**
   * Handler for when drag ends. Handles moving tasks, updating state, and deletion.
   * @param result - DropResult from drag-and-drop
   */
  const onDragEnd = async (result: DropResult) => {
    const { source, destination } = result;
    setShowDeleteColumn(false);
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }
    const taskId = data.columns[source.droppableId].taskIds?.[source.index];
    if (destination.droppableId === 'delete-column') {
      if (taskId) {
        setTaskToDelete(taskId);
      }
    } else if (taskId && destination.droppableId !== source.droppableId) {
      try {
        await taskServices.updateTaskState(taskId, destination.droppableId);
        await fetchTasks();
      } catch (error) {
        console.error('Failed to update task state:', error);
      }
    }
    const startColumn = data.columns[source.droppableId];
    const endColumn = data.columns[destination.droppableId];
    if (startColumn === endColumn) {
      const newTaskIds = Array.from(startColumn.taskIds || []);
      const [moved] = newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, moved);
      const newColumn = { ...startColumn, taskIds: newTaskIds };
      setData({
        ...data,
        columns: { ...data.columns, [newColumn.id]: newColumn },
      });
    } else {
      const startTaskIds = Array.from(startColumn.taskIds || []);
      const [moved] = startTaskIds.splice(source.index, 1);
      const endTaskIds = Array.from(endColumn.taskIds || []);
      endTaskIds.splice(destination.index, 0, moved);
      setData({
        ...data,
        columns: {
          ...data.columns,
          [startColumn.id]: { ...startColumn, taskIds: startTaskIds },
          [endColumn.id]: { ...endColumn, taskIds: endTaskIds },
        },
      });
    }
  };

  return {
    showDeleteColumn,
    setShowDeleteColumn,
    taskToDelete,
    setTaskToDelete,
    onBeforeDragStart,
    onDragEnd,
  };
} 