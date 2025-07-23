import React from 'react';
import { CheckCircle, XCircle, Mail, Calendar, ExternalLink, Brain, Zap } from 'lucide-react';
import { TaskResult as TaskResultType, TaskInterpretation } from '../types';

interface TaskResultProps {
  result: TaskResultType;
  interpretation: TaskInterpretation;
}

export const TaskResult: React.FC<TaskResultProps> = ({ result, interpretation }) => {
  const isSuccess = result.success;
  const actionType = interpretation.action_type;

  const getActionIcon = () => {
    switch (actionType) {
      case 'email':
        return <Mail size={20} />;
      case 'calendar':
        return <Calendar size={20} />;
      default:
        return <Zap size={20} />;
    }
  };

  const getActionColor = () => {
    return isSuccess ? 'text-green-600' : 'text-red-600';
  };

  const getBgColor = () => {
    return isSuccess ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-100';
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className={`p-6 rounded-xl border-2 ${getBgColor()} shadow-lg`}>
      <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 ${getActionColor()}`}>
          {isSuccess ? <CheckCircle size={28} /> : <XCircle size={28} />}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <div className={getActionColor()}>
              {getActionIcon()}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              {isSuccess ? 'Task Completed Successfully! 🎉' : 'Task Failed ❌'}
            </h3>
          </div>

          {/* AI Interpretation */}
          <div className="mb-4 p-4 bg-white bg-opacity-70 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="text-purple-600" size={18} />
              <h4 className="font-medium text-gray-800">TaskLinx AI Analysis:</h4>
            </div>
            <p className="text-sm text-gray-700 mb-3">{interpretation.reasoning}</p>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <span className="text-gray-600">Action:</span>
                <span className="font-semibold text-gray-800 uppercase tracking-wide">{interpretation.action_type}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-gray-600">Confidence:</span>
                <span className={`px-2 py-1 rounded-full font-semibold text-xs ${getConfidenceColor(interpretation.confidence)}`}>
                  {Math.round(interpretation.confidence * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Result Details */}
          {isSuccess ? (
            <div className="space-y-3">
              {actionType === 'email' && result.details && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h5 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                    <Mail size={16} />
                    Email Sent Successfully
                  </h5>
                  <div className="text-sm space-y-1">
                    <p><span className="font-medium text-blue-800">To:</span> <span className="text-blue-700">{result.details.to}</span></p>
                    <p><span className="font-medium text-blue-800">Subject:</span> <span className="text-blue-700">{result.details.subject}</span></p>
                    <p><span className="font-medium text-blue-800">From:</span> <span className="text-blue-700">{result.details.from}</span></p>
                    {result.message_id && (
                      <p><span className="font-medium text-blue-800">Message ID:</span> <span className="text-blue-700 font-mono text-xs">{result.message_id}</span></p>
                    )}
                  </div>
                </div>
              )}
              
              {actionType === 'calendar' && result.details && (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h5 className="font-medium text-green-900 mb-2 flex items-center gap-2">
                    <Calendar size={16} />
                    Calendar Event Created
                  </h5>
                  <div className="text-sm space-y-1">
                    <p><span className="font-medium text-green-800">Event:</span> <span className="text-green-700">{result.details.title}</span></p>
                    <p><span className="font-medium text-green-800">Start:</span> <span className="text-green-700">{new Date(result.details.start).toLocaleString()}</span></p>
                    <p><span className="font-medium text-green-800">End:</span> <span className="text-green-700">{new Date(result.details.end).toLocaleString()}</span></p>
                    {result.details.description && (
                      <p><span className="font-medium text-green-800">Description:</span> <span className="text-green-700">{result.details.description}</span></p>
                    )}
                    {result.event_link && (
                      <div className="mt-2">
                        <a
                          href={result.event_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-green-700 hover:text-green-900 font-medium text-sm hover:underline"
                        >
                          <ExternalLink size={14} />
                          Open in Google Calendar
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h5 className="font-medium text-red-900 mb-2">Error Details:</h5>
              <p className="text-sm text-red-700">{result.error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 