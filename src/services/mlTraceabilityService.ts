
import { MLServiceResult } from '@/types/ml';

class MLTraceabilityService {
  private readonly services = [
    {
      id: 'vision-ai',
      name: 'Vision AI Service',
      endpoint: '/api/vision',
      delay: 1200
    },
    {
      id: 'nlp-processor',
      name: 'NLP Processor',
      endpoint: '/api/nlp',
      delay: 800
    },
    {
      id: 'sentiment-analyzer',
      name: 'Sentiment Analyzer',
      endpoint: '/api/sentiment',
      delay: 600
    },
    {
      id: 'content-classifier',
      name: 'Content Classifier',
      endpoint: '/api/classifier',
      delay: 1000
    },
    {
      id: 'quality-assessor',
      name: 'Quality Assessor',
      endpoint: '/api/quality',
      delay: 900
    }
  ];

  async analyzeContent(cid: string): Promise<MLServiceResult[]> {
    console.log('Analyzing content for CID:', cid);
    
    const promises = this.services.map(service => 
      this.callService(service, cid)
    );

    const results = await Promise.allSettled(promises);
    
    return results.map((result, index) => {
      const service = this.services[index];
      
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        console.error(`Service ${service.name} failed:`, result.reason);
        return {
          serviceId: service.id,
          serviceName: service.name,
          status: 'error' as const,
          error: result.reason?.message || 'Service call failed',
          responseTime: 0,
          timestamp: new Date().toISOString()
        };
      }
    });
  }

  private async callService(service: any, cid: string): Promise<MLServiceResult> {
    const startTime = Date.now();
    
    console.log(`Calling ${service.name} for CID: ${cid}`);
    
    try {
      // Simulate API call with realistic delay
      await new Promise(resolve => setTimeout(resolve, service.delay));
      
      const responseTime = Date.now() - startTime;
      
      // Generate realistic mock data based on service type
      const mockData = this.generateMockResponse(service.id, cid);
      
      return {
        serviceId: service.id,
        serviceName: service.name,
        status: 'success',
        data: mockData,
        responseTime,
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      throw {
        serviceId: service.id,
        serviceName: service.name,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        responseTime,
        timestamp: new Date().toISOString()
      };
    }
  }

  private generateMockResponse(serviceId: string, cid: string) {
    const baseScore = 0.3 + Math.random() * 0.6; // 30-90% range
    
    switch (serviceId) {
      case 'vision-ai':
        return {
          scores: {
            image_quality: Math.min(0.95, baseScore + Math.random() * 0.2),
            object_detection: Math.min(0.95, baseScore + Math.random() * 0.15),
            scene_understanding: Math.min(0.95, baseScore + Math.random() * 0.25)
          },
          metadata: {
            model_version: 'v2.1.3',
            processing_time: '245ms',
            confidence_threshold: 0.7
          }
        };
        
      case 'nlp-processor':
        return {
          scores: {
            text_coherence: Math.min(0.95, baseScore + Math.random() * 0.2),
            semantic_understanding: Math.min(0.95, baseScore + Math.random() * 0.15),
            language_quality: Math.min(0.95, baseScore + Math.random() * 0.18)
          },
          metadata: {
            model_version: 'transformer-xl-v1.2',
            tokens_processed: Math.floor(Math.random() * 1000) + 100,
            language_detected: 'en'
          }
        };
        
      case 'sentiment-analyzer':
        return {
          scores: {
            sentiment_confidence: Math.min(0.95, baseScore + Math.random() * 0.3),
            emotion_detection: Math.min(0.95, baseScore + Math.random() * 0.2),
            tone_analysis: Math.min(0.95, baseScore + Math.random() * 0.25)
          },
          metadata: {
            primary_sentiment: ['positive', 'negative', 'neutral'][Math.floor(Math.random() * 3)],
            model_version: 'bert-sentiment-v3.0',
            processing_method: 'deep_analysis'
          }
        };
        
      case 'content-classifier':
        return {
          scores: {
            category_confidence: Math.min(0.95, baseScore + Math.random() * 0.2),
            content_relevance: Math.min(0.95, baseScore + Math.random() * 0.15),
            classification_accuracy: Math.min(0.95, baseScore + Math.random() * 0.22)
          },
          metadata: {
            primary_category: ['technology', 'science', 'arts', 'business'][Math.floor(Math.random() * 4)],
            sub_categories: Math.floor(Math.random() * 5) + 1,
            model_version: 'classifier-ensemble-v4.1'
          }
        };
        
      case 'quality-assessor':
        return {
          scores: {
            overall_quality: Math.min(0.95, baseScore + Math.random() * 0.2),
            technical_quality: Math.min(0.95, baseScore + Math.random() * 0.18),
            content_originality: Math.min(0.95, baseScore + Math.random() * 0.25)
          },
          metadata: {
            quality_grade: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)],
            assessment_criteria: 'comprehensive_v2.3',
            benchmarked_against: 'industry_standard'
          }
        };
        
      default:
        return {
          scores: {
            general_score: baseScore
          },
          metadata: {
            service_id: serviceId,
            cid: cid
          }
        };
    }
  }

  mergeScores(results: MLServiceResult[]): Record<string, number> {
    const allScores: Record<string, number[]> = {};
    
    // Collect all scores from successful results
    results.forEach(result => {
      if (result.status === 'success' && result.data?.scores) {
        Object.entries(result.data.scores).forEach(([metric, score]) => {
          if (!allScores[metric]) {
            allScores[metric] = [];
          }
          allScores[metric].push(score);
        });
      }
    });
    
    // Calculate merged scores (average)
    const mergedScores: Record<string, number> = {};
    Object.entries(allScores).forEach(([metric, scores]) => {
      if (scores.length > 0) {
        mergedScores[metric] = scores.reduce((sum, score) => sum + score, 0) / scores.length;
      }
    });
    
    console.log('Merged scores calculated:', mergedScores);
    return mergedScores;
  }
}

export const mlTraceabilityService = new MLTraceabilityService();
