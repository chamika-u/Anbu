import axios, { AxiosError } from 'axios';

// In dev, Vite proxies /api → http://localhost:5000 automatically.
// In production, set VITE_API_URL to point at your deployed backend.
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 180000, // 3 minutes – AI generation can be slow
});

// ── Types ─────────────────────────────────────────────────────────────────────

export interface AnalyzeRequest {
  repo_url: string;
}

export interface ChecklistTask {
  id: string;
  title: string;
}

export interface RepoMetadata {
  repo_name: string;
  owner: string;
  tech_stack: string[];
  dependencies_count: number;
  generated_at: string;
  ai_generated?: boolean;
  checklist?: ChecklistTask[];
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
export const analyzeRepository = async (repoUrl: string): Promise<AnalyzeResponse> => {
  try {
    const response = await api.post<AnalyzeResponse>('/api/analyze', { repo_url: repoUrl });
    const data = response.data;

    // The backend can return success:true OR success:false with a 200 status.
    // Normalise both cases so callers only deal with one path.
    if (!data.success) {
      throw new Error(data.error || 'Failed to generate documentation');
    }

    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(extractErrorMessage(error, 'Failed to analyze repository'), { cause: error });
    }
    // Re-throw normalised Error objects (from the !data.success branch above)
    throw error instanceof Error ? error : new Error(String(error), { cause: error });
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

/** Delete a document by ID. */
export const deleteDocument = async (documentId: string): Promise<void> => {
  try {
    await api.delete(`/api/documents/${documentId}`);
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'Failed to delete document'), { cause: error });
  }
};

export default api;
