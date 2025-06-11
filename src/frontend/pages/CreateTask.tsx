import React, { useState } from 'react';

export default function CreateTask() {
  const [formData, setFormData] = useState({
    task_description: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createTask = async (content: string) => {
    try {
      const response = await fetch('/addTask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      const data = await response.json();
      console.log('Task created:', data);
      setSuccess(true);
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setError(errorMessage);
      throw error;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTaskCreation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsLoading(true);

    const { task_description } = formData;
    const description = task_description.trim();

    if (!description) {
      setError('Both title and description are required');
      setIsLoading(false);
      return;
    }

    try {
      const content = `content: ${description}`;
      await createTask(content);
      setFormData({task_description: '' });
    } catch (error) {
      console.error('Task creation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-task-container">
      <form className="create-task-form" onSubmit={handleTaskCreation}>
        <h2 className="form-title">Create New Task</h2>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">Task created successfully!</div>}

        <div className="form-group">
          <label htmlFor="task_description">Task Description</label>
          <textarea
            id="task_description"
            name="task_description"
            value={formData.task_description}
            onChange={handleInputChange}
            required
          />
        </div>

        <button 
          className="submit-button" 
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Creating...' : 'Create Task'}
        </button>
      </form>
    </div>
  );
}