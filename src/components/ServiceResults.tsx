
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { MLServiceResult } from '@/types/ml';

interface ServiceResultsProps {
  results: MLServiceResult[];
  loading: boolean;
}

export const ServiceResults: React.FC<ServiceResultsProps> = ({ results, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-500 animate-spin" />
                  <Badge variant="outline" className="text-orange-600 border-orange-200">
                    Processing
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                <div className="h-2 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {results.map((result) => (
        <Card key={result.serviceId} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">
                {result.serviceName}
              </CardTitle>
              <div className="flex items-center gap-2">
                {result.status === 'success' ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : result.status === 'error' ? (
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                ) : (
                  <Clock className="h-4 w-4 text-orange-500" />
                )}
                <Badge 
                  variant={result.status === 'success' ? 'default' : result.status === 'error' ? 'destructive' : 'secondary'}
                >
                  {result.status}
                </Badge>
              </div>
            </div>
            <CardDescription>
              Response time: {result.responseTime}ms
            </CardDescription>
          </CardHeader>
          <CardContent>
            {result.status === 'success' && result.data ? (
              <div className="space-y-4">
                <div className="space-y-3">
                  {Object.entries(result.data.scores || {}).map(([metric, score]) => (
                    <div key={metric} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium capitalize">
                          {metric.replace('_', ' ')}
                        </span>
                        <span className="text-sm text-gray-600">
                          {(score * 100).toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={score * 100} className="h-2" />
                    </div>
                  ))}
                </div>
                
                {result.data.metadata && (
                  <div className="pt-3 border-t border-gray-100">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Metadata</h4>
                    <div className="text-xs text-gray-500 space-y-1">
                      {Object.entries(result.data.metadata).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="capitalize">{key}:</span>
                          <span className="font-mono">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : result.status === 'error' ? (
              <div className="text-red-600 text-sm">
                {result.error || 'An error occurred while processing the request'}
              </div>
            ) : (
              <div className="text-gray-500 text-sm">
                Processing request...
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
