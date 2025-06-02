
export interface MLServiceResult {
  serviceId: string;
  serviceName: string;
  status: 'success' | 'error' | 'pending';
  data?: {
    scores: Record<string, number>;
    metadata?: Record<string, any>;
  };
  error?: string;
  responseTime: number;
  timestamp: string;
}

export interface MergedScores {
  [metric: string]: number;
}

export interface AnalysisConfig {
  services: string[];
  timeout: number;
  retries: number;
}
