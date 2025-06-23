// Board.tsx
// This component renders the main Kanban board, handling drag-and-drop and task management.
// It uses custom hooks for board data and drag-and-drop logic, and renders columns and the delete area.

import React, { useEffect } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { Link } from 'react-router-dom';
import ColumnComponent from '../components/ColumnComponent';
import DeleteTaskComponent from '../components/DeleteTaskComponent';
import { useBoardData } from '../hooks/useBoardData';
import { useBoardDnD } from '../hooks/useBoardDnD';

/**
 * Board component displays the Kanban board with columns and tasks.
 * Handles drag-and-drop and task deletion using custom hooks.
 */
const Board: React.FC = () => {
  // useBoardData manages board state and fetching tasks from backend
  const { data, setData, fetchTasks } = useBoardData();
  const {
    showDeleteColumn,
    taskToDelete,
    setTaskToDelete,
    onBeforeDragStart,
    onDragEnd,
  } = useBoardDnD(data, setData, fetchTasks);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <>
      <Link to="/add">Add new task</Link>
      <DragDropContext onDragEnd={onDragEnd} onBeforeDragStart={onBeforeDragStart}>
        {/* Regular columns in a row */}
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          {data.columnOrder
            .filter((columnId) => columnId !== 'delete-column')
            .map((columnId) => {
              const column = data.columns[columnId];
              return (
                <ColumnComponent key={column.id} {...column} tasks={data.tasks} />
              );
            })}
        </div>
        {/* Delete column at the bottom, centered */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
          <DeleteTaskComponent
            isVisible={showDeleteColumn}
            taskID={taskToDelete}
            setTaskToDelete={setTaskToDelete}
          />
        </div>
      </DragDropContext>
    </>
  );
};

export default Board;