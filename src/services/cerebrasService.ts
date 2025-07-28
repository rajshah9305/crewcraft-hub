import { toast } from "sonner";

export interface CerebrasMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface CerebrasCompletionParams {
  model?: string;
  messages: CerebrasMessage[];
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  stream?: boolean;
}

export interface CerebrasResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: CerebrasMessage;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class CerebrasService {
  private apiKey: string;
  private baseUrl = 'https://api.cerebras.ai/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  static getStoredApiKey(): string | null {
    return localStorage.getItem('cerebras_api_key');
  }

  static setStoredApiKey(apiKey: string): void {
    localStorage.setItem('cerebras_api_key', apiKey);
  }

  static clearStoredApiKey(): void {
    localStorage.removeItem('cerebras_api_key');
  }

  async validateApiKey(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      return response.ok;
    } catch (error) {
      console.error('API key validation failed:', error);
      return false;
    }
  }

  async getModels(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.status}`);
      }

      const data = await response.json();
      return data.data?.map((model: any) => model.id) || [];
    } catch (error) {
      console.error('Error fetching models:', error);
      toast.error('Failed to fetch available models');
      return [];
    }
  }

  async generateCompletion(params: CerebrasCompletionParams): Promise<CerebrasResponse> {
    try {
      const requestBody = {
        model: params.model || 'llama3.1-8b',
        messages: params.messages,
        max_tokens: params.max_tokens || 1000,
        temperature: params.temperature || 0.7,
        top_p: params.top_p || 0.9,
        stream: params.stream || false,
      };

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API request failed: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error generating completion:', error);
      toast.error('Failed to generate AI completion');
      throw error;
    }
  }

  async generateAgentResponse(prompt: string, systemPrompt?: string): Promise<string> {
    const messages: CerebrasMessage[] = [];
    
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    
    messages.push({ role: 'user', content: prompt });

    try {
      const response = await this.generateCompletion({
        messages,
        temperature: 0.7,
        max_tokens: 2000,
      });

      return response.choices[0]?.message?.content || 'No response generated';
    } catch (error) {
      throw new Error('Failed to generate agent response');
    }
  }

  async streamCompletion(
    params: CerebrasCompletionParams,
    onChunk: (chunk: string) => void
  ): Promise<void> {
    try {
      const requestBody = {
        ...params,
        stream: true,
      };

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Stream reader not available');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') return;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                onChunk(content);
              }
            } catch (e) {
              // Ignore parsing errors for malformed chunks
            }
          }
        }
      }
    } catch (error) {
      console.error('Error streaming completion:', error);
      throw error;
    }
  }
}