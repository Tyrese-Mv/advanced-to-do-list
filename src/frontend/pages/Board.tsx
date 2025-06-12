import React, { useState, useEffect } from 'react';
import {
  DragDropContext,
  type DropResult
} from '@hello-pangea/dnd';
import type { BoardData } from '../../util/types';
import { taskServices } from '../services/coreServices';
import ColumnComponent from '../components/ColumnComponent';
import { Link } from 'react-router-dom';

const initialData: BoardData = {
  tasks: {},
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'To Do',
      taskIds: [],
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
  
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await taskServices.getAllTasks();
        const taskList = response.tasks;

        setData(prev => ({
          ...prev,
          tasks: taskList.reduce((acc, task) => ({ ...acc, [task.id]: task }), {}),
          columns: {
            ...prev.columns,
            'column-1': {
              ...prev.columns['column-1'],
              taskIds: taskList.map(task => task.id)
            }
          }
        }));
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      }
    };

    fetchTasks();
  }, []);


  const onDragEnd = async (result: DropResult) => {
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
      const newTaskIds = Array.from(startColumn.taskIds || []);
      const [moved] = newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, moved);

      const newColumn = { ...startColumn, taskIds: newTaskIds };
      setData({
        ...data,
        columns: { ...data.columns, [newColumn.id]: newColumn },
      });
    } else {
      // Moving to different column
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

  return (
    <>
    <Link to="/add">Add new task</Link>
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: 'flex', gap: '20px' }}>
        {data.columnOrder.map((columnId) => {
          const column = data.columns[columnId];
          return <ColumnComponent key={column.id} {...column} tasks={data.tasks} />;
        })}
      </div>
    </DragDropContext>
    </>
    
  );
};

export default Board;