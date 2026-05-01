import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 120000, // 2 minutes timeout for AI processing
});

export interface AnalyzeRequest {
  repo_url: string;
}

export interface AnalyzeResponse {
  success: boolean;
  documentation?: string;
  metadata?: {
    repo_name: string;
    owner: string;
    tech_stack: string[];
    dependencies_count: number;
    generated_at: string;
    ai_generated?: boolean;
  };
  share_url?: string;
  using_watsonx?: boolean;
  error?: string;
}

export interface HealthResponse {
  status: string;
  version: string;
}

export interface ChatRequest {
  message: string;
  conversation_id?: string;
  model_id?: string;
}

export interface ChatResponse {
  response: string;
  conversation_id: string;
  model_id: string;
}

export interface DocumentUploadResponse {
  success: boolean;
  document_id: string;
  filename: string;
  message: string;
}

// Repository Analysis
export const analyzeRepository = async (repoUrl: string): Promise<AnalyzeResponse> => {
  try {
    const response = await api.post<AnalyzeResponse>('/api/analyze', {
      repo_url: repoUrl,
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Failed to analyze repository');
    }
    throw new Error('Network error. Please check your connection.');
  }
};

// Health Check
export const checkHealth = async (): Promise<HealthResponse> => {
  try {
    const response = await api.get<HealthResponse>('/api/health');
    return response.data;
  } catch (error) {
    throw new Error('Failed to connect to server');
  }
};

// Chat with AI
export const sendChatMessage = async (
  message: string,
  conversationId?: string,
  modelId?: string
): Promise<ChatResponse> => {
  try {
    const response = await api.post<ChatResponse>('/api/chat', {
      message,
      conversation_id: conversationId,
      model_id: modelId,
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Failed to send message');
    }
    throw new Error('Network error. Please check your connection.');
  }
};

// Upload Document
export const uploadDocument = async (file: File): Promise<DocumentUploadResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<DocumentUploadResponse>('/api/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Failed to upload document');
    }
    throw new Error('Network error. Please check your connection.');
  }
};

// Get all documents
export const getDocuments = async (): Promise<any[]> => {
  try {
    const response = await api.get('/api/documents');
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Failed to fetch documents');
    }
    throw new Error('Network error. Please check your connection.');
  }
};

// Delete document
export const deleteDocument = async (documentId: string): Promise<void> => {
  try {
    await api.delete(`/api/documents/${documentId}`);
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Failed to delete document');
    }
    throw new Error('Network error. Please check your connection.');
  }
};

export default api;

// Made with Bob
