
import { useState, useCallback } from 'react';
import { MLServiceResult } from '@/types/ml';
import { mlTraceabilityService } from '@/services/mlTraceabilityService';
import { toast } from 'sonner';

export const useMLTraceability = () => {
  const [results, setResults] = useState<MLServiceResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mergedScores, setMergedScores] = useState<Record<string, number>>({});

  const fetchMLResults = useCallback(async (cid: string) => {
    setLoading(true);
    setError(null);
    setResults([]);
    setMergedScores({});

    try {
      console.log('Starting ML traceability analysis for CID:', cid);
      
      const serviceResults = await mlTraceabilityService.analyzeContent(cid);
      setResults(serviceResults);

      // Calculate merged scores
      const merged = mlTraceabilityService.mergeScores(serviceResults);
      setMergedScores(merged);

      const successfulResults = serviceResults.filter(r => r.status === 'success');
      const errorResults = serviceResults.filter(r => r.status === 'error');

      console.log('Analysis complete:', {
        total: serviceResults.length,
        successful: successfulResults.length,
        errors: errorResults.length,
        mergedScores: merged
      });

      if (successfulResults.length > 0) {
        toast.success(`Analysis complete! ${successfulResults.length} services processed successfully.`);
      }

      if (errorResults.length > 0) {
        toast.warning(`${errorResults.length} services encountered errors during processing.`);
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('ML traceability error:', err);
      toast.error('Failed to analyze content: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    results,
    loading,
    error,
    mergedScores,
    fetchMLResults
  };
};
