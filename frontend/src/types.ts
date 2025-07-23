export interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

export interface TaskInterpretation {
  action_type: string;
  parameters: Record<string, any>;
  confidence: number;
  reasoning: string;
}

export interface TaskResult {
  success: boolean;
  error?: string;
  details?: Record<string, any>;
  message_id?: string;
  event_id?: string;
  event_link?: string;
}

export interface Task {
  id: string;
  timestamp: string;
  user_input: string;
  interpretation: TaskInterpretation;
  result: TaskResult;
  status: 'processing' | 'completed' | 'failed';
}

export interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  error?: string;
} 