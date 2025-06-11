import { Column } from "../../util/types";
import React from 'react';
import {
  Droppable,
  Draggable,
  type DropResult
} from '@hello-pangea/dnd';
export default function ColumnComponent(prop: Column){
    // const tasks = prop.taskIds?.map((taskId) => prop.tasks[taskId]);

    return (
        <Droppable droppableId={prop.id} key={prop.id}>
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
                <h3>{prop.title}</h3>
                {prop.taskIds?.map((task, index) => (
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
        
}