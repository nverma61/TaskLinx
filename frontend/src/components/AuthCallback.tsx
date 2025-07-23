import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader, CheckCircle, XCircle, Zap } from 'lucide-react';

export const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');

        if (error) {
          setError(`Authentication error: ${error}`);
          setStatus('error');
          return;
        }

        if (!code) {
          setError('No authorization code received');
          setStatus('error');
          return;
        }

        await login(code);
        setStatus('success');
        
        // Redirect to main app after short delay
        setTimeout(() => {
          navigate('/');
        }, 2000);
        
      } catch (err) {
        console.error('Authentication failed:', err);
        setError('Authentication failed. Please try again.');
        setStatus('error');
      }
    };

    handleCallback();
  }, [login, navigate]);

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="text-center">
            <div className="relative mb-6">
              <Zap className="mx-auto text-blue-600" size={64} />
              <Loader className="absolute top-0 left-1/2 transform -translate-x-1/2 animate-spin text-purple-600" size={24} />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-gray-900">Connecting to TaskLinx...</h2>
            <p className="text-gray-600">Please wait while we complete your authentication.</p>
          </div>
        );
      
      case 'success':
        return (
          <div className="text-center">
            <CheckCircle className="mx-auto mb-6 text-green-600" size={64} />
            <h2 className="text-2xl font-bold mb-3 text-green-800">Welcome to TaskLinx! 🎉</h2>
            <p className="text-gray-600 mb-4">Authentication successful! Redirecting you to the dashboard...</p>
            <div className="flex items-center justify-center gap-2 text-blue-600">
              <Loader className="animate-spin" size={16} />
              <span className="text-sm">Loading TaskLinx...</span>
            </div>
          </div>
        );
      
      case 'error':
        return (
          <div className="text-center">
            <XCircle className="mx-auto mb-6 text-red-600" size={64} />
            <h2 className="text-2xl font-bold mb-3 text-red-800">Authentication Failed</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-medium transition-all transform hover:scale-105"
            >
              Back to TaskLinx
            </button>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8">
        {renderContent()}
      </div>
    </div>
  );
}; 