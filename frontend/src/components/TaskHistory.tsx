import React, { useState, useEffect } from 'react';
import { Clock, Mail, Calendar, CheckCircle, XCircle, RefreshCw, Zap } from 'lucide-react';
import { Task } from '../types';
import { apiService } from '../services/api';

export const TaskHistory: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiService.getTaskHistory(20);
      setTasks(response.tasks);
    } catch (err) {
      setError('Failed to load task history');
      console.error('Failed to load history:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'email':
        return <Mail size={16} className="text-blue-600" />;
      case 'calendar':
        return <Calendar size={16} className="text-green-600" />;
      default:
        return <Zap size={16} className="text-purple-600" />;
    }
  };

  const getStatusIcon = (status: string, success: boolean) => {
    if (status === 'processing') {
      return <RefreshCw size={16} className="text-yellow-600 animate-spin" />;
    }
    return success ? (
      <CheckCircle size={16} className="text-green-600" />
    ) : (
      <XCircle size={16} className="text-red-600" />
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <RefreshCw className="animate-spin mx-auto mb-4 text-blue-600" size={32} />
          <span className="text-gray-600">Loading TaskLinx history...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <XCircle className="mx-auto mb-4 text-red-500" size={32} />
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={loadHistory}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 text-gray-600">
        <Clock size={64} className="mx-auto mb-6 text-gray-300" />
        <h3 className="text-lg font-medium text-gray-800 mb-2">No Tasks Yet</h3>
        <p className="text-sm">Your TaskLinx automation history will appear here.</p>
        <p className="text-xs mt-2 text-gray-500">Start by typing a command above!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Clock size={20} className="text-blue-600" />
          TaskLinx History
        </h2>
        <button
          onClick={loadHistory}
          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="Refresh history"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <div key={task.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                {getActionIcon(task.interpretation.action_type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <p className="font-medium text-gray-900 truncate text-sm">
                    {task.user_input}
                  </p>
                  <div className="flex-shrink-0">
                    {getStatusIcon(task.status, task.result.success)}
                  </div>
                </div>
                
                <div className="text-xs text-gray-600 mb-2 flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <span className="font-medium">Action:</span>
                    <span className="uppercase bg-gray-100 px-2 py-0.5 rounded text-xs font-semibold">
                      {task.interpretation.action_type}
                    </span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="font-medium">Confidence:</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      task.interpretation.confidence >= 0.8 
                        ? 'bg-green-100 text-green-800' 
                        : task.interpretation.confidence >= 0.6 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {Math.round(task.interpretation.confidence * 100)}%
                    </span>
                  </span>
                </div>
                
                {task.result.success ? (
                  <div className="text-xs text-green-700 bg-green-50 px-2 py-1 rounded">
                    ✓ Completed successfully
                    {task.result.details && task.interpretation.action_type === 'email' && (
                      <span className="ml-2">→ {task.result.details.to}</span>
                    )}
                    {task.result.details && task.interpretation.action_type === 'calendar' && (
                      <span className="ml-2">→ {task.result.details.title}</span>
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-red-700 bg-red-50 px-2 py-1 rounded">
                    ✗ {task.result.error}
                  </div>
                )}
                
                <div className="text-xs text-gray-400 mt-2">
                  {new Date(task.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 