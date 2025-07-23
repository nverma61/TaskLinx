import React, { useState } from 'react';
import { Send, Loader, Zap } from 'lucide-react';
import { apiService } from '../services/api';
import { TaskResult, TaskInterpretation } from '../types';

interface TaskInputProps {
  onTaskComplete: (result: TaskResult, interpretation: TaskInterpretation) => void;
}

export const TaskInput: React.FC<TaskInputProps> = ({ onTaskComplete }) => {
  const [task, setTask] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task.trim() || isExecuting) return;

    setIsExecuting(true);
    try {
      const response = await apiService.executeTask(task);
      onTaskComplete(response.result, response.interpretation);
      setTask('');
    } catch (error) {
      console.error('Failed to execute task:', error);
      onTaskComplete(
        { success: false, error: 'Failed to execute task. Please try again.' },
        { action_type: 'error', parameters: {}, confidence: 0, reasoning: 'Network error' }
      );
    } finally {
      setIsExecuting(false);
    }
  };

  const exampleTasks = [
    "Email Alice to reschedule our meeting to tomorrow at 3 PM",
    "Create a calendar event for team sync tomorrow at 2 PM",
    "Send a follow-up email to John about the project status",
    "Schedule a call with the marketing team for Friday at 10 AM"
  ];

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="relative">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Tell TaskLinx what you need done..."
            className="w-full px-6 py-4 pr-16 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg placeholder-gray-400 shadow-sm"
            disabled={isExecuting}
          />
          <button
            type="submit"
            disabled={!task.trim() || isExecuting}
            className="absolute right-2 top-2 bottom-2 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg font-medium transition-all flex items-center gap-2 shadow-md"
          >
            {isExecuting ? (
              <Loader className="animate-spin" size={20} />
            ) : (
              <>
                <Zap size={18} />
                <Send size={18} />
              </>
            )}
          </button>
        </div>
        {isExecuting && (
          <div className="mt-3 text-center">
            <div className="inline-flex items-center gap-2 text-blue-600">
              <Loader className="animate-spin" size={16} />
              <span className="text-sm">TaskLinx AI is processing your request...</span>
            </div>
          </div>
        )}
      </form>

      <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="text-blue-600" size={16} />
          <span className="font-medium text-gray-800">Try these TaskLinx commands:</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {exampleTasks.map((example, index) => (
            <button
              key={index}
              onClick={() => setTask(example)}
              className="text-left p-2 hover:bg-white hover:shadow-sm rounded border border-gray-200 text-blue-600 hover:text-blue-800 transition-all text-xs"
              disabled={isExecuting}
            >
              "{example}"
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}; 