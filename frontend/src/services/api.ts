import axios, { AxiosInstance } from 'axios';
import { config } from '../config';
import { Task, TaskResult, TaskInterpretation, User } from '../types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: config.API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add token to requests if available
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  // Auth methods
  async getLoginUrl(): Promise<string> {
    const response = await this.api.get('/auth/login');
    return response.data.auth_url;
  }

  async exchangeCodeForToken(code: string): Promise<{ access_token: string; user_info: any }> {
    const response = await this.api.post('/auth/callback', { code });
    return response.data;
  }

  async getUserProfile(): Promise<User> {
    const response = await this.api.get('/user/profile');
    return response.data;
  }

  // Task methods
  async executeTask(task: string): Promise<{
    success: boolean;
    task_id: string;
    result: TaskResult;
    interpretation: TaskInterpretation;
  }> {
    const response = await this.api.post('/tasks/execute', { task });
    return response.data;
  }

  async getTaskHistory(limit: number = 20): Promise<{ tasks: Task[] }> {
    const response = await this.api.get(`/tasks/history?limit=${limit}`);
    return response.data;
  }
}

export const apiService = new ApiService(); 