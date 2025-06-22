import { renderHook, act } from '@testing-library/react';
import { useBoardData } from '../hooks/useBoardData';
import { TaskState } from '../../util/types';
import { taskServices } from '../services/coreServices';

jest.mock('../services/coreServices', () => ({
  taskServices: {
    getAllTasks: jest.fn(),
  },
}));

describe('useBoardData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with the correct initial board data', () => {
    const { result } = renderHook(() => useBoardData());
    expect(result.current.data.columns['TODO']).toBeDefined();
    expect(result.current.data.columns['IN_PROGRESS']).toBeDefined();
    expect(result.current.data.columns['DONE']).toBeDefined();
    expect(result.current.data.columns['delete-column']).toBeDefined();
    expect(result.current.data.columnOrder).toEqual([
      'TODO',
      'IN_PROGRESS',
      'DONE',
      'delete-column',
    ]);
  });

  it('should fetch tasks and update board data correctly', async () => {
    const mockTasks = [
      { id: '1', content: 'Task 1', taskState: TaskState.TODO },
      { id: '2', content: 'Task 2', taskState: TaskState.IN_PROGRESS },
      { id: '3', content: 'Task 3', taskState: TaskState.DONE },
    ];
    (taskServices.getAllTasks as jest.Mock).mockResolvedValue({ tasks: mockTasks });
    const { result } = renderHook(() => useBoardData());
    await act(async () => {
      await result.current.fetchTasks();
    });
    expect(result.current.data.tasks).toHaveProperty('1');
    expect(result.current.data.tasks).toHaveProperty('2');
    expect(result.current.data.tasks).toHaveProperty('3');
    expect(result.current.data.columns['TODO'].taskIds).toContain('1');
    expect(result.current.data.columns['IN_PROGRESS'].taskIds).toContain('2');
    expect(result.current.data.columns['DONE'].taskIds).toContain('3');
  });

  it('should handle empty tasks gracefully', async () => {
    (taskServices.getAllTasks as jest.Mock).mockResolvedValue({ tasks: [] });
    const { result } = renderHook(() => useBoardData());
    await act(async () => {
      await result.current.fetchTasks();
    });
    expect(result.current.data.tasks).toEqual({});
    expect(result.current.data.columns['TODO'].taskIds).toEqual([]);
    expect(result.current.data.columns['IN_PROGRESS'].taskIds).toEqual([]);
    expect(result.current.data.columns['DONE'].taskIds).toEqual([]);
  });

  it('should handle fetch errors gracefully', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (taskServices.getAllTasks as jest.Mock).mockRejectedValue(new Error('Network error'));
    const { result } = renderHook(() => useBoardData());
    await act(async () => {
      await result.current.fetchTasks();
    });
    expect(errorSpy).toHaveBeenCalledWith('Failed to fetch tasks:', expect.any(Error));
    errorSpy.mockRestore();
  });
}); 