// ColumnComponent.tsx
// Renders a single column in the Kanban board, including its tasks as draggable items.

import React from 'react';
import {
  Droppable,
  Draggable,
} from '@hello-pangea/dnd';
import { Column, Task } from '../../util/types';

/**
 * Props for ColumnComponent
 * @property tasks - Mapping of task IDs to Task objects
 */
interface ColumnComponentProps extends Column {
  tasks: { [key: string]: Task };
}

/**
 * ColumnComponent
 * Displays a column with its tasks, making them draggable within the column.
 * @param id - Column ID
 * @param title - Column title
 * @param taskIds - Array of task IDs in this column
 * @param tasks - Mapping of all tasks
 */
export default function ColumnComponent({ id, title, taskIds = [], tasks }: ColumnComponentProps) {
    return (
        <Droppable droppableId={id} key={id}>
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
                    <h3>{title}</h3>
                    {taskIds.map((taskId, index) => {
                        const task = tasks[taskId];
                        if (!task) return null;
                        
                        return (
                            <Draggable draggableId={taskId} index={index} key={taskId}>
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
                        );
                    })}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    );
}