import React, { useState } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult
} from '@hello-pangea/dnd';
import type { BoardData } from '../../util/types';

const initialData: BoardData = {
  tasks: {
    'task-1': { id: 'task-1', content: 'Write resume' },
    'task-2': { id: 'task-2', content: 'Learn TypeScript' },
    'task-3': { id: 'task-3', content: 'Build a portfolio' },
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'To Do',
      taskIds: ['task-1', 'task-2', 'task-3'],
    },
    'column-2': {
      id: 'column-2',
      title: 'Done',
      taskIds: [],
    },
  },
  columnOrder: ['column-1', 'column-2'],
};

const Board: React.FC = () => {
  const [data, setData] = useState<BoardData>(initialData);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const startColumn = data.columns[source.droppableId];
    const endColumn = data.columns[destination.droppableId];

    // Moving within same column
    if (startColumn === endColumn) {
      const newTaskIds = Array.from(startColumn.taskIds);
      const [moved] = newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, moved);

      const newColumn = { ...startColumn, taskIds: newTaskIds };
      setData({
        ...data,
        columns: { ...data.columns, [newColumn.id]: newColumn },
      });
    } else {
      // Moving to different column
      const startTaskIds = Array.from(startColumn.taskIds);
      const [moved] = startTaskIds.splice(source.index, 1);
      const endTaskIds = Array.from(endColumn.taskIds);
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

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: 'flex', gap: '20px' }}>
        {data.columnOrder.map((columnId) => {
          const column = data.columns[columnId];
          const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);

          return (
            <Droppable droppableId={column.id} key={column.id}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{
                    background: '#f4f4f4',
                    padding: 10,
                    width: 250,
                    minHeight: 300,
                  }}
                >
                  <h3>{column.title}</h3>
                  {tasks.map((task, index) => (
                    <Draggable draggableId={task.id} index={index} key={task.id}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            padding: 12,
                            marginBottom: 8,
                            backgroundColor: snapshot.isDragging ? '#007acc' : '#005f99',
                            color: 'white',
                            borderRadius: 4,
                            ...provided.draggableProps.style,
                          }}
                        >
                          {task.content}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          );
        })}
      </div>
    </DragDropContext>
  );
};

export default Board;