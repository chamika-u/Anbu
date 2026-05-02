import axios, { AxiosError } from 'axios';

// In dev, Vite proxies /api → http://localhost:5000 automatically.
// In production, set VITE_API_URL to point at your deployed backend.
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 180000, // 3 minutes
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('anbu_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Types ─────────────────────────────────────────────────────────────────────

export interface User {
  id: number;
  email: string;
  has_github_token: boolean;
  created_at: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  error?: string;
}

export interface AuthRequest {
  email: string;
  password?: string;
}

export interface AnalyzeRequest {
  repo_url: string;
}

export interface ChecklistTask {
  id: string;
  title: string;
}

export interface RepoMetadata {
  id?: number;
  repo_name: string;
  owner: string;
  tech_stack: string[];
  dependencies_count: number;
  generated_at: string;
  ai_generated?: boolean;
  is_private?: boolean;
  checklist?: ChecklistTask[];
  progress?: Record<string, boolean>;
}

export interface AnalyzeResponse {
  success: boolean;
  documentation?: string;
  metadata?: RepoMetadata;
  share_url?: string;
  using_watsonx?: boolean;
  error?: string;
}

export interface HealthResponse {
  status: string;
  service?: string;
  version?: string;
}

export interface ChatRequest {
  message: string;
  conversation_id?: string;
  model_id?: string;
}

export interface ChatResponse {
  response?: string;
  message?: string;
  conversation_id: string;
  model_id?: string;
  error?: string;
}

export interface DocumentUploadResponse {
  success?: boolean;
  document_id?: string;
  id?: string;
  filename: string;
  message?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Extract a human-readable error message from an Axios error or unknown error.
 */
function extractErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof AxiosError) {
    // Server responded with an error payload
    if (error.response?.data) {
      const data = error.response.data as Record<string, unknown>;
      if (typeof data.error === 'string') return data.error;
      if (typeof data.message === 'string') return data.message;
    }
    // Network / timeout
    if (error.code === 'ECONNABORTED') {
      return 'Request timed out. The repository may be too large or the server is slow.';
    }
    if (!error.response) {
      return 'Cannot reach the server. Make sure the backend is running on port 5000.';
    }
  }
  if (error instanceof Error) return error.message;
  return fallback;
}

// ── API functions ─────────────────────────────────────────────────────────────

/** Analyze a GitHub repository and return generated documentation. */
export const analyzeRepository = async (repoUrl: string, onProgress?: (msg: string) => void): Promise<AnalyzeResponse> => {
  const token = localStorage.getItem('anbu_token');
  try {
    const response = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ repo_url: repoUrl })
    });

    if (!response.ok) {
      let errorMsg = 'Failed to analyze repository';
      try {
        const errorData = await response.json();
        errorMsg = errorData.error || errorData.message || errorMsg;
      } catch (e) {
        // Not JSON
      }
      throw new Error(errorMsg);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response stream');

    const decoder = new TextDecoder();
    let buffer = '';
    let result: AnalyzeResponse | null = null;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n\n');
      buffer = lines.pop() || ''; // Keep the last incomplete part in the buffer

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.status === 'progress' && onProgress) {
              onProgress(data.message);
            } else if (data.status === 'complete') {
              result = data.result;
            } else if (data.status === 'error') {
              throw new Error(data.error);
            }
          } catch (e) {
            // Check if it's a JSON parse error or our custom error
            if (e instanceof Error && !e.message.includes('JSON')) {
              throw e;
            }
            console.error('Error parsing SSE data', e, 'Line was:', line);
          }
        }
      }
    }

    if (!result) {
      throw new Error('Server closed connection before completing analysis');
    }

    if (!result.success) {
      throw new Error(result.error || 'Failed to generate documentation');
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(String(error));
  }
};

/** Health check – returns server status. */
export const checkHealth = async (): Promise<HealthResponse> => {
  try {
    const response = await api.get<HealthResponse>('/api/health');
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'Failed to connect to server'), { cause: error });
  }
};

/** Send a chat message to the AI. */
export const sendChatMessage = async (
  message: string,
  conversationId?: string,
  modelId?: string,
): Promise<ChatResponse> => {
  try {
    const response = await api.post<ChatResponse>('/api/chat', {
      message,
      conversation_id: conversationId,
      model_id: modelId,
    });
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'Failed to send message'), { cause: error });
  }
};

/** Upload a document for processing. */
export const uploadDocument = async (file: File): Promise<DocumentUploadResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<DocumentUploadResponse>('/api/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'Failed to upload document'), { cause: error });
  }
};

/** Retrieve all uploaded documents. */
export const getDocuments = async (): Promise<DocumentUploadResponse[]> => {
  try {
    const response = await api.get<DocumentUploadResponse[]>('/api/documents');
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'Failed to fetch documents'), { cause: error });
  }
};

export const deleteDocument = async (documentId: string): Promise<void> => {
  try {
    await api.delete(`/api/documents/${documentId}`);
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'Failed to delete document'), { cause: error });
  }
};

export interface HistoryAnalysis {
  id: number;
  repo_url: string;
  owner: string;
  repo_name: string;
  documentation: string;
  metadata: RepoMetadata;
  progress: Record<string, boolean>;
  created_at: string;
}

export interface HistoryResponse {
  success: boolean;
  history?: HistoryAnalysis[];
  error?: string;
}

/** Fetch previously analyzed repositories history */
export const getHistory = async (): Promise<HistoryAnalysis[]> => {
  try {
    const response = await api.get<HistoryResponse>('/api/history');
    if (!response.data.success || !response.data.history) {
      throw new Error(response.data.error || 'Failed to fetch history');
    }
    return response.data.history;
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'Failed to fetch history'), { cause: error });
  }
};

/** Sync progress to the backend */
export const updateProgress = async (analysisId: number, progress: Record<string, boolean>): Promise<void> => {
  try {
    await api.post(`/api/history/${analysisId}/progress`, { progress });
  } catch (error) {
    console.error('Failed to sync progress:', error);
  }
};

/** Save a newly generated analysis to the dashboard */
export const saveAnalysis = async (repoUrl: string, owner: string, repoName: string, documentation: string, metadata: RepoMetadata, progress: Record<string, boolean> = {}): Promise<{ id: number }> => {
  try {
    const response = await api.post('/api/history/save', {
      repo_url: repoUrl,
      owner,
      repo_name: repoName,
      documentation,
      metadata,
      progress
    });
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to save analysis');
    }
    return { id: response.data.id };
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'Failed to save analysis'), { cause: error });
  }
};

/** Delete an analysis record */
export const deleteAnalysis = async (analysisId: number): Promise<boolean> => {
  try {
    const response = await api.delete(`/api/history/${analysisId}`);
    return response.data.success;
  } catch (error) {
    console.error('Failed to delete analysis:', error);
    return false;
  }
};

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/api/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('anbu_token', response.data.token);
    }
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'Login failed'), { cause: error });
  }
};

export const registerUser = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/api/auth/register', { email, password });
    if (response.data.token) {
      localStorage.setItem('anbu_token', response.data.token);
    }
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'Registration failed'), { cause: error });
  }
};

export const getMe = async (): Promise<AuthResponse> => {
  try {
    const response = await api.get<AuthResponse>('/api/auth/me');
    return response.data;
  } catch (error) {
    localStorage.removeItem('anbu_token');
    throw new Error(extractErrorMessage(error, 'Authentication failed'), { cause: error });
  }
};

export const logoutUser = () => {
  localStorage.removeItem('anbu_token');
};

/** Save or update the user's GitHub Personal Access Token */
export const updateGitHubToken = async (token: string): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/api/auth/github-token', { github_token: token });
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'Failed to save GitHub token'), { cause: error });
  }
};

/** Remove the user's stored GitHub Personal Access Token */
export const deleteGitHubToken = async (): Promise<AuthResponse> => {
  try {
    const response = await api.delete<AuthResponse>('/api/auth/github-token');
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'Failed to remove GitHub token'), { cause: error });
  }
};

export default api;
