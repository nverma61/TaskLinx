import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginButton } from './components/LoginButton';
import { TaskInput } from './components/TaskInput';
import { TaskResult } from './components/TaskResult';
import { TaskHistory } from './components/TaskHistory';
import { AuthCallback } from './components/AuthCallback';
import { TaskResult as TaskResultType, TaskInterpretation } from './types';
import { config } from './config';
import { LogOut, User, Zap, Brain, Mail, Calendar } from 'lucide-react';
import './App.css';

const MainApp: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [currentResult, setCurrentResult] = useState<{
    result: TaskResultType;
    interpretation: TaskInterpretation;
  } | null>(null);

  const handleTaskComplete = (result: TaskResultType, interpretation: TaskInterpretation) => {
    setCurrentResult({ result, interpretation });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-2xl p-10 text-center">
          <div className="mb-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="relative">
                <Zap size={48} className="text-blue-600" />
                <Brain size={24} className="absolute -top-2 -right-2 text-purple-600" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {config.APP_NAME}
              </h1>
            </div>
            <p className="text-gray-600 text-lg leading-relaxed">
              {config.APP_DESCRIPTION}
            </p>
            <p className="text-gray-500 mt-2">
              Transform your natural language into powerful automations
            </p>
          </div>
          
          <div className="space-y-6">
            <LoginButton />
            
            <div className="text-sm text-gray-500 bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-700 mb-3 flex items-center justify-center gap-2">
                <Zap size={16} className="text-blue-600" />
                What TaskLinx can do:
              </h3>
              <div className="grid grid-cols-1 gap-2 text-left">
                <div className="flex items-center gap-2 text-xs">
                  <Mail size={14} className="text-blue-500" />
                  <span>"Email John about the project update"</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Calendar size={14} className="text-green-500" />
                  <span>"Schedule team meeting tomorrow at 2 PM"</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Zap size={14} className="text-purple-500" />
                  <span>"Send follow-up email to the client"</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Zap size={36} className="text-blue-600" />
                <Brain size={20} className="absolute -top-1 -right-1 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {config.APP_NAME}
                </h1>
                <p className="text-xs text-gray-500">AI Task Automation</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {user && (
                <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                  <User size={16} />
                  <span className="font-medium">{user.name}</span>
                </div>
              )}
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Task Input Section */}
          <div className="xl:col-span-2 space-y-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Brain className="text-purple-600" size={24} />
                What would you like TaskLinx to do?
              </h2>
              <TaskInput onTaskComplete={handleTaskComplete} />
            </div>

            {/* Current Result */}
            {currentResult && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Zap className="text-blue-600" size={20} />
                  Latest Result
                </h3>
                <TaskResult 
                  result={currentResult.result} 
                  interpretation={currentResult.interpretation} 
                />
              </div>
            )}
          </div>

          {/* Task History Sidebar */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
              <TaskHistory />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <span>Powered by</span>
            <div className="flex items-center gap-1">
              <Brain size={14} className="text-purple-600" />
              <span className="font-medium">OpenAI GPT-4</span>
            </div>
            <span>•</span>
            <span className="font-medium">Google APIs</span>
            <span>•</span>
            <span className="font-medium">TaskLinx AI</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainApp />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App; 