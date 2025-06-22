import { act, renderHook } from '@testing-library/react';
import { useBoardDnD } from '../hooks/useBoardDnD';
import { TaskState, BoardData } from '../../util/types';
import { taskServices } from '../services/coreServices';

jest.mock('../services/coreServices', () => ({
  taskServices: {
    updateTaskState: jest.fn(),
  },
}));

describe('useBoardDnD', () => {
  const baseData: BoardData = {
    tasks: {
      '1': { id: '1', content: 'Task 1', taskState: TaskState.TODO },
      '2': { id: '2', content: 'Task 2', taskState: TaskState.IN_PROGRESS },
    },
    columns: {
      TODO: { id: 'TODO', title: 'To Do', taskIds: ['1'] },
      IN_PROGRESS: { id: 'IN_PROGRESS', title: 'In Progress', taskIds: ['2'] },
      DONE: { id: 'DONE', title: 'Done', taskIds: [] },
      'delete-column': { id: 'delete-column', title: 'Delete', taskIds: [] },
    },
    columnOrder: ['TODO', 'IN_PROGRESS', 'DONE', 'delete-column'],
  };
  let data: BoardData;
  let setData: jest.Mock;
  let fetchTasks: jest.Mock;

  beforeEach(() => {
    data = JSON.parse(JSON.stringify(baseData));
    setData = jest.fn();
    fetchTasks = jest.fn().mockResolvedValue(undefined);
    jest.clearAllMocks();
  });

  it('should show delete column on drag start', () => {
    const { result } = renderHook(() => useBoardDnD(data, setData, fetchTasks));
    act(() => {
      result.current.onBeforeDragStart();
    });
    expect(result.current.showDeleteColumn).toBe(true);
  });

  it('should do nothing if no destination on drag end', async () => {
    const { result } = renderHook(() => useBoardDnD(data, setData, fetchTasks));
    await act(async () => {
      await result.current.onDragEnd({
        draggableId: '1',
        type: 'DEFAULT',
        reason: 'DROP',
        mode: 'FLUID',
        source: { droppableId: 'TODO', index: 0 },
        destination: null,
        combine: null,
      });
    });
    expect(setData).not.toHaveBeenCalled();
  });

  it('should do nothing if source and destination are the same', async () => {
    const { result } = renderHook(() => useBoardDnD(data, setData, fetchTasks));
    await act(async () => {
      await result.current.onDragEnd({
        draggableId: '1',
        type: 'DEFAULT',
        reason: 'DROP',
        mode: 'FLUID',
        source: { droppableId: 'TODO', index: 0 },
        destination: { droppableId: 'TODO', index: 0 },
        combine: null,
      });
    });
    expect(setData).not.toHaveBeenCalled();
  });

  it('should set taskToDelete if dropped in delete column', async () => {
    const { result } = renderHook(() => useBoardDnD(data, setData, fetchTasks));
    await act(async () => {
      await result.current.onDragEnd({
        draggableId: '1',
        type: 'DEFAULT',
        reason: 'DROP',
        mode: 'FLUID',
        source: { droppableId: 'TODO', index: 0 },
        destination: { droppableId: 'delete-column', index: 0 },
        combine: null,
      });
    });
    expect(result.current.taskToDelete).toBe('1');
  });

  it('should call updateTaskState and fetchTasks when moving between columns', async () => {
    (taskServices.updateTaskState as jest.Mock).mockResolvedValue({ tasks: [] });
    const { result } = renderHook(() => useBoardDnD(data, setData, fetchTasks));
    await act(async () => {
      await result.current.onDragEnd({
        draggableId: '1',
        type: 'DEFAULT',
        reason: 'DROP',
        mode: 'FLUID',
        source: { droppableId: 'TODO', index: 0 },
        destination: { droppableId: 'IN_PROGRESS', index: 0 },
        combine: null,
      });
    });
    expect(taskServices.updateTaskState).toHaveBeenCalledWith('1', 'IN_PROGRESS');
    expect(fetchTasks).toHaveBeenCalled();
  });

  it('should update task order within the same column', async () => {
    data.columns.TODO.taskIds = ['1', '2'];
    const { result } = renderHook(() => useBoardDnD(data, setData, fetchTasks));
    await act(async () => {
      await result.current.onDragEnd({
        draggableId: '1',
        type: 'DEFAULT',
        reason: 'DROP',
        mode: 'FLUID',
        source: { droppableId: 'TODO', index: 0 },
        destination: { droppableId: 'TODO', index: 1 },
        combine: null,
      });
    });
    expect(setData).toHaveBeenCalledWith(expect.objectContaining({
      columns: expect.objectContaining({
        TODO: expect.objectContaining({ taskIds: ['2', '1'] }),
      }),
    }));
  });

  it('should update task order between columns', async () => {
    data.columns.TODO.taskIds = ['1'];
    data.columns.IN_PROGRESS.taskIds = ['2'];
    const { result } = renderHook(() => useBoardDnD(data, setData, fetchTasks));
    await act(async () => {
      await result.current.onDragEnd({
        draggableId: '1',
        type: 'DEFAULT',
        reason: 'DROP',
        mode: 'FLUID',
        source: { droppableId: 'TODO', index: 0 },
        destination: { droppableId: 'IN_PROGRESS', index: 1 },
        combine: null,
      });
    });
    expect(setData).toHaveBeenCalledWith(expect.objectContaining({
      columns: expect.objectContaining({
        TODO: expect.objectContaining({ taskIds: [] }),
        IN_PROGRESS: expect.objectContaining({ taskIds: ['2', '1'] }),
      }),
    }));
  });

  it('should handle errors in updateTaskState gracefully', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (taskServices.updateTaskState as jest.Mock).mockRejectedValue(new Error('Update error'));
    const { result } = renderHook(() => useBoardDnD(data, setData, fetchTasks));
    await act(async () => {
      await result.current.onDragEnd({
        draggableId: '1',
        type: 'DEFAULT',
        reason: 'DROP',
        mode: 'FLUID',
        source: { droppableId: 'TODO', index: 0 },
        destination: { droppableId: 'IN_PROGRESS', index: 0 },
        combine: null,
      });
    });
    expect(errorSpy).toHaveBeenCalledWith('Failed to update task state:', expect.any(Error));
    errorSpy.mockRestore();
  });
}); 