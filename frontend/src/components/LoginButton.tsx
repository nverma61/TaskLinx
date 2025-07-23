import React, { useState } from 'react';
import { LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const LoginButton: React.FC = () => {
  const { getLoginUrl } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const loginUrl = await getLoginUrl();
      window.location.href = loginUrl;
    } catch (error) {
      console.error('Failed to get login URL:', error);
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogin}
      disabled={isLoading}
      className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-3 rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg"
    >
      <LogIn size={20} />
      {isLoading ? 'Connecting to Google...' : 'Sign in with Google'}
    </button>
  );
}; 